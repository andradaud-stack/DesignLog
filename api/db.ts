import { connect, type Connection } from '@tidbcloud/serverless';

let cachedConnection: Connection<any> | null = null;

export function getDb() {
  if (cachedConnection) return cachedConnection;

  const url = process.env.TIDB_DATABASE_URL || process.env.DATABASE_URL;
  const host = process.env.TIDB_HOST;
  const username = process.env.TIDB_USER;
  const password = process.env.TIDB_PASSWORD;
  const database = process.env.TIDB_DATABASE || 'test';

  if (!url && (!host || !username)) {
    return null;
  }

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
