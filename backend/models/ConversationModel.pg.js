import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({ connectionString: process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING });

const audioDir = path.join(__dirname, '..', 'data', 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

async function getRecent(sessionID, limit = 25) {
  const q = `SELECT id, session_id, role, text, intent, payload, metadata, created_at FROM conversations WHERE ($1::text IS NULL OR session_id = $1) ORDER BY created_at DESC LIMIT $2`;
  const params = [sessionID || null, Math.min(200, limit)];
  const { rows } = await pool.query(q, params);
  return rows.reverse(); // return oldest-first
}

async function getAllConversations(opts = {}) {
  if (opts.sessionID) return getRecent(opts.sessionID, 1000);
  const { rows } = await pool.query('SELECT * FROM conversations ORDER BY created_at ASC LIMIT 1000');
  return rows;
}

async function searchMessages(sessionID, q, limit = 25) {
  if (!q) return getRecent(sessionID, limit);
  const s = `%${q.toLowerCase()}%`;
  const sql = `SELECT id, session_id, role, text, intent, payload, metadata, created_at FROM conversations WHERE ($1::text IS NULL OR session_id = $1) AND (lower(text) LIKE $2 OR lower(coalesce(payload::text,'')) LIKE $2) ORDER BY created_at DESC LIMIT $3`;
  const { rows } = await pool.query(sql, [sessionID || null, s, Math.min(200, limit)]);
  return rows.reverse();
}

async function saveMessage(msg) {
  // If caller supplied an id use it, otherwise let the DB generate one (via gen_random_uuid()).
  // We use COALESCE($1::uuid, gen_random_uuid()) so INSERTs that pass NULL still get a UUID.
  const sql = `INSERT INTO conversations (id, session_id, role, text, intent, payload, metadata, created_at)
               VALUES (COALESCE($1::uuid, gen_random_uuid()), $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, now())
               RETURNING id, session_id, role, text, intent, payload, metadata, created_at`;
  const params = [msg.id || null, msg.sessionID || msg.session_id || 'unknown', msg.role || 'user', msg.text || msg.voiceTranscript || null, msg.intent ? JSON.stringify(msg.intent) : null, msg.payload ? JSON.stringify(msg.payload) : null, msg.metadata ? JSON.stringify(msg.metadata) : null];
  const { rows } = await pool.query(sql, params);
  return rows[0];
}

import crypto from 'crypto';

async function saveAudioBlob(sessionID, base64Data, mimeType) {
  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.length > 10 * 1024 * 1024) throw new Error('audio-too-large');
  const ext = (mimeType && mimeType.split('/')[1]) || 'webm';
  const id = crypto.randomUUID();
  const filename = `${id}.${ext}`;
  const filepath = path.join(audioDir, filename);
  fs.writeFileSync(filepath, buffer);
  const sql = `INSERT INTO audio_files (id, session_id, filename, content_type, path, size_bytes, created_at) VALUES ($1,$2,$3,$4,$5,$6,now()) RETURNING id, filename, path, content_type, size_bytes, created_at`;
  const { rows } = await pool.query(sql, [id, sessionID, filename, mimeType, `data/audio/${filename}`, buffer.length]);
  return Object.assign(rows[0], { sessionID });
}

async function getSampleConversation() {
  const { rows } = await pool.query("SELECT id, session_id, role, text, intent, payload, metadata, created_at FROM conversations WHERE session_id = 'demo-session' ORDER BY created_at ASC LIMIT 50");
  return rows;
}

export { getRecent, getAllConversations, searchMessages, saveMessage, saveAudioBlob, getSampleConversation };
