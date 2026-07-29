import { Client } from 'pg';
import { Resend } from 'resend';

// Basic in-memory rate limiting (best-effort for warm lambdas)
const rateLimitStore = new Map(); // ip -> lastTimestamp
const RATE_LIMIT_WINDOW_MS = 30_000; // 30 seconds

function getIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string') return xf.split(',')[0].trim();
  if (Array.isArray(xf)) return xf[0];
  return req.socket?.remoteAddress || 'unknown';
}

// Send email notification via Resend
async function sendEmailNotification(name, email, message) {
  if (!process.env.RESEND_API_KEY) return;
  
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['abhishek274kumar@gmail.com'],
      subject: `📬 New Message from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff; border-radius: 16px;">
          <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="margin: 0; font-size: 24px; color: #f59e0b;">📬 New Portfolio Message</h1>
            <p style="margin: 8px 0 0; color: #888; font-size: 13px;">${timestamp} IST</p>
          </div>
          
          <div style="background: #141414; padding: 20px; border-radius: 12px; border: 1px solid #222; margin-bottom: 16px;">
            <p style="margin: 0 0 4px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">From</p>
            <p style="margin: 0; font-size: 18px; font-weight: 600;">${name}</p>
          </div>
          
          <div style="background: #141414; padding: 20px; border-radius: 12px; border: 1px solid #222; margin-bottom: 16px;">
            <p style="margin: 0 0 4px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</p>
            <a href="mailto:${email}" style="color: #f59e0b; font-size: 16px; text-decoration: none;">${email}</a>
          </div>
          
          <div style="background: #141414; padding: 20px; border-radius: 12px; border: 1px solid #222; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="mailto:${email}?subject=Re: Your message on Abhi's Creative Studio" style="display: inline-block; background: #f59e0b; color: #000; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
          </div>
          
          <p style="margin: 24px 0 0; color: #555; font-size: 11px; text-align: center;">Sent from abhiclicks-studio.vercel.app contact form</p>
        </div>
      `,
    });
  } catch (err) {
    // Don't fail the request if email fails — DB save is what matters
    console.error('Email notification failed:', err.message);
  }
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

    // Send email notification (fire-and-forget, doesn't block response)
    sendEmailNotification(name, email, message);

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
