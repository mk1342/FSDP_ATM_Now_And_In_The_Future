import fs from 'fs';
import path from 'path';

// Prefer Postgres-backed model when DATABASE_URL/PGHOST is present; fall back to file-backed store
let getAllConversations, saveMessage, saveAudioBlob, getRecent, searchMessages, getSampleConversation;
let activeModel = 'file'; // 'file' or 'postgres' — exposed for diagnostics
// ensure handlers wait for model to be available (prevents race on startup)
let modelReadyResolve;
const modelReady = new Promise(r => { modelReadyResolve = r; });
(async () => {
  try {
    if (process.env.DATABASE_URL || process.env.PGHOST || process.env.PG_CONNECTION_STRING) {
      // dynamic import so PG dependency is optional
      const pgModel = await import('../models/ConversationModel.pg.js');
      getAllConversations = pgModel.getAllConversations;
      saveMessage = pgModel.saveMessage;
      saveAudioBlob = pgModel.saveAudioBlob;
      getRecent = pgModel.getRecent;
      searchMessages = pgModel.searchMessages;
      getSampleConversation = pgModel.getSampleConversation;
      activeModel = 'postgres';
      console.log('Using Postgres-backed ConversationModel');
      modelReadyResolve();
      return;
    }
  } catch (err) {
    console.warn('Postgres ConversationModel failed to load, falling back to file-backed store:', err && err.message);
  }
  const fileModel = await import('../models/ConversationModel.js');
  getAllConversations = fileModel.getAllConversations;
  saveMessage = fileModel.saveMessage;
  saveAudioBlob = fileModel.saveAudioBlob;
  getRecent = fileModel.getRecent;
  searchMessages = fileModel.searchMessages;
  getSampleConversation = fileModel.getSampleConversation;
  activeModel = 'file';
  console.log('Using file-backed ConversationModel');
  modelReadyResolve();
})();

// helper used by each handler to await model readiness
const waitForModel = async () => {
  return await modelReady;
};

// Diagnostic: returns which model is active and whether DATABASE_URL is set
export const getModel = async (req, res) => {
  await waitForModel();
  try {
    return res.status(200).json({ success: true, backend: activeModel, databaseUrlPresent: Boolean(process.env.DATABASE_URL) });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const postMessage = async (req, res) => {
  await waitForModel();
  try {
    const body = req.body || {};
    if (!body.sessionID || !body.role || (!body.text && !body.voiceTranscript && !body.payload && !body.audio)) {
      return res.status(400).json({ success: false, error: 'Missing required fields (sessionID, role, text/voice/payload/audio)' });
    }

    // if audio is provided as base64 payload, save it to disk and attach metadata
    if (body.audio && body.audio.data && body.audio.mimeType) {
      // limit size (5 MB)
      const approxBytes = Math.ceil((body.audio.data.length * 3) / 4);
      if (approxBytes > 5 * 1024 * 1024) return res.status(413).json({ success: false, error: 'Audio payload too large' });
      const meta = await saveAudioBlob(body.sessionID, body.audio.data, body.audio.mimeType);
      body.audio = { id: meta.id, path: meta.path || meta.audioPath, mimeType: meta.content_type || meta.mimeType, size: meta.size || meta.size_bytes };
    }

    const saved = await saveMessage(body);
    // surface which backend persisted the record (helps debug which model handled the request)
    try { saved._backend = activeModel; } catch (e) { /* ignore readonly */ }
    console.log('conversation saved', { backend: activeModel, id: saved && saved.id });
    return res.status(200).json({ success: true, saved, backend: activeModel });
  } catch (err) {
    console.error('Error saving conversation message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getConversations = async (req, res) => {
  await waitForModel();
  try {
    const { sessionID } = req.query;
    const rows = await getAllConversations(sessionID ? { sessionID } : {});
    return res.status(200).json(rows);
  } catch (err) {
    console.error('Error reading conversations:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getContext = async (req, res) => {
  await waitForModel();
  try {
    const { sessionID, limit = 25, q } = req.query;
    const lim = Math.min(200, Number(limit) || 25);
    let rows = q ? await searchMessages(sessionID, q, lim) : await getRecent(sessionID, lim);
    // if no rows found for the requested session, return a seeded demo conversation (prevents empty UI / crashes)
    if ((!rows || rows.length === 0) && sessionID) {
      rows = await getSampleConversation();
    }
    // if still empty, return a tiny builtin fallback
    if (!rows || rows.length === 0) rows = [ { role: 'assistant', text: 'No conversation found — try asking "Show my balance".', timestamp: new Date().toISOString() } ];

    // return compact training-ready structure with sessionID preserved for admin grouping
    const out = rows.map(r => ({ 
      id: r.id, 
      sessionID: r.sessionID || r.session_id || 'unknown', 
      role: r.role || (r.audioPath ? 'user' : 'assistant'), 
      text: r.text || (r.voiceTranscript || '') || (r.payload ? JSON.stringify(r.payload) : ''), 
      timestamp: r.timestamp,
      created_at: r.created_at || r.timestamp,
      intent: r.intent,
      audio: r.audio,
      payload: r.payload,
      voiceTranscript: r.voiceTranscript
    }));
    return res.status(200).json({ success: true, items: out });
  } catch (err) {
    console.error('Error getting context:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getAudio = (req, res) => {
  try {
    const id = req.params.id;
    const audioDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'data', 'audio');
    // find the file by id prefix
    const files = fs.readdirSync(audioDir).filter(f => f.startsWith(id + '.'));
    if (!files.length) return res.status(404).send('Not found');
    const file = path.join(audioDir, files[0]);
    const stat = fs.statSync(file);
    res.setHeader('Content-Type', 'audio/' + files[0].split('.').pop());
    res.setHeader('Content-Length', stat.size);
    const stream = fs.createReadStream(file);
    stream.pipe(res);
  } catch (err) {
    console.error('Error serving audio:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
