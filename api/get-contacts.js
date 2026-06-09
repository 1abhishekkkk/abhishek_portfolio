import { Client } from 'pg';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'Admin access is not configured' });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'Database is not configured' });
  }

  // Check authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  let client;
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    
    await client.connect();

    // Get all contacts ordered by newest first
    const result = await client.query(`
      SELECT id, name, email, message, created_at 
      FROM contacts 
      ORDER BY created_at DESC
    `);
    return res.status(200).json({ 
      contacts: result.rows,
      total: result.rows.length 
    });
  } catch (err) {
    console.error('get-contacts error:', err);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}
