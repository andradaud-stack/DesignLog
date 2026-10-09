import { connect, type Connection } from '@tidbcloud/serverless';

let cachedConnection: Connection<any> | null = null;

export function getDb() {
  if (cachedConnection) return cachedConnection;

  const url = process.env.TIDB_DATABASE_URL || process.env.DATABASE_URL;
  const host = process.env.TIDB_HOST || process.env.DB_HOST;
  const username = process.env.TIDB_USER || process.env.DB_USERNAME || process.env.DB_USER;
  const password = process.env.TIDB_PASSWORD || process.env.DB_PASSWORD;
  const rawDb = process.env.TIDB_DATABASE || process.env.DB_DATABASE;
  // 'sys' is MySQL system diagnostic schema; user tables belong in 'test' or custom app database
  const database = rawDb && rawDb !== 'sys' ? rawDb : 'test';

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
