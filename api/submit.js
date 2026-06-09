import { Client } from 'pg';

// Basic in-memory rate limiting (best-effort for warm lambdas)
const rateLimitStore = new Map(); // ip -> lastTimestamp
const RATE_LIMIT_WINDOW_MS = 30_000; // 30 seconds

function getIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string') return xf.split(',')[0].trim();
  if (Array.isArray(xf)) return xf[0];
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Contact form is not configured' });
  }

  let client;
  try {
    // Rate limit per IP
    const ip = getIp(req);
    const now = Date.now();
    const last = rateLimitStore.get(ip) || 0;
    if (now - last < RATE_LIMIT_WINDOW_MS) {
      return res.status(429).json({ error: 'Too many requests. Please wait a bit and try again.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, email, message } = body || {};

    // Basic validation
    const isEmail = (v) => /.+@.+/.test(v);
    if (typeof name !== 'string' || name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!isEmail(email) || email.length > 200) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (typeof message !== 'string' || message.length < 5 || message.length > 5000) {
      return res.status(400).json({ error: 'Invalid message length' });
    }

    // Simple spam phrase blocklist
    const lower = message.toLowerCase();
    const blocked = ['viagra', 'seo backlinks', 'porn', 'casino'];
    if (blocked.some((w) => lower.includes(w))) {
      return res.status(400).json({ error: 'Message rejected' });
    }


    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    // Update rate limit store after successful insert
    rateLimitStore.set(ip, Date.now());
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit error:', err);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}
