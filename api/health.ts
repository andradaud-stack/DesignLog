import { getDb } from './db';

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  const db = getDb();
  if (!db) {
    return res.status(200).json({
      status: 'offline_mode',
      connected: false,
      message: 'TiDB credentials not configured. App is running in Local Storage mode.',
    });
  }

  try {
    const result = await db.execute('SELECT 1 as is_connected, NOW() as server_time');
    return res.status(200).json({
      status: 'connected',
      connected: true,
      message: 'Successfully connected to TiDB Serverless Cloud!',
      details: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      status: 'error',
      connected: false,
      message: 'Failed to query TiDB database',
      error: err.message || String(err),
    });
  }
}
