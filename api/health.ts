import { connect, type Connection } from '@tidbcloud/serverless';

let cachedConnection: Connection<any> | null = null;

function getDb() {
  if (cachedConnection) return cachedConnection;

  const url = process.env.TIDB_DATABASE_URL || process.env.DATABASE_URL;
  const host = process.env.TIDB_HOST || process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
  const username = process.env.TIDB_USER || process.env.DB_USERNAME || process.env.DB_USER || '3RbgZ6hjaMgBu6v.root';
  const password = process.env.TIDB_PASSWORD || process.env.DB_PASSWORD || 'EVHQahIcZPhNGKc2';
  const rawDb = process.env.TIDB_DATABASE || process.env.DB_DATABASE || 'test';
  const database = rawDb && rawDb !== 'sys' ? rawDb : 'test';

  try {
    cachedConnection = connect({
      url,
      host,
      username,
      password,
      database,
    });
    return cachedConnection;
  } catch (error) {
    console.error('Failed to initialize TiDB connection:', error);
    return null;
  }
}

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
