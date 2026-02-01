import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const dataFilePath = path.join(dataDir, 'conversations.json');

// Ensure file exists and seed with example data so pages have demo content
if (!fs.existsSync(dataFilePath)) {
  fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
  const now = new Date().toISOString();
  const demoSession = 'demo-session';
  const sample = [
    { id: 'm_demo_1', sessionID: demoSession, role: 'assistant', text: "Hi — I'm the OCBC AI helpdesk. Try asking 'Show my balance' or 'Find ATM fees'.", timestamp: now },
    { id: 'm_demo_2', sessionID: demoSession, role: 'user', text: 'Show my balance', timestamp: now },
    { id: 'm_demo_3', sessionID: demoSession, role: 'assistant', text: 'Available balance: $5,243.12', intent: { intent: 'balance' }, payload: { available: 5243.12 }, timestamp: now }
  ];
  fs.writeFileSync(dataFilePath, JSON.stringify(sample, null, 2));
  console.log('Created data folder and conversations.json (seeded demo conversation)');
}

const readAll = () => {
  const raw = fs.readFileSync(dataFilePath, 'utf8');
  try { return JSON.parse(raw || '[]'); } catch (e) { return []; }
};

// sample helper exposed for controllers
export const getSampleConversation = () => {
  return readAll().filter(r => r.sessionID === 'demo-session');
};

export const getAllConversations = (opts = {}) => {
  const all = readAll();
  if (opts.sessionID) return all.filter(m => m.sessionID === opts.sessionID);
  return all;
};

export const getRecent = (sessionID, limit = 25) => {
  const all = getAllConversations(sessionID ? { sessionID } : {});
  return all.slice(-limit);
};

export const searchMessages = (sessionID, q, limit = 25) => {
  if (!q) return getRecent(sessionID, limit);
  const all = getAllConversations(sessionID ? { sessionID } : {});
  const s = q.toLowerCase();
  return all.filter(r => (r.text || '').toLowerCase().includes(s) || (JSON.stringify(r.payload || {}).toLowerCase().includes(s))).slice(-limit);
};

export const saveMessage = (msg) => {
  const conversations = readAll();
  const now = new Date().toISOString();
  const toSave = Object.assign({ id: crypto.randomUUID(), timestamp: now }, msg);
  conversations.push(toSave);
  fs.writeFileSync(dataFilePath, JSON.stringify(conversations, null, 2));
  return toSave;
};

export const saveAudioBlob = (sessionID, base64Data, mimeType) => {
  // base64Data should be the data URL payload (without data:...base64, prefix)
  const audioDir = path.join(path.dirname(dataFilePath), 'audio');
  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
  const id = crypto.randomUUID();
  let ext = 'webm';
  if (mimeType && mimeType.includes('/')) ext = mimeType.split('/')[1].split(';')[0];
  const filename = `${id}.${ext}`;
  const filePath = path.join(audioDir, filename);
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);
  // record a lightweight reference in the conversation store
  const meta = { id, sessionID, audioPath: `data/audio/${filename}`, mimeType, size: buffer.length, timestamp: new Date().toISOString() };
  const conversations = readAll();
  conversations.push(meta);
  fs.writeFileSync(dataFilePath, JSON.stringify(conversations, null, 2));
  return meta;
};
