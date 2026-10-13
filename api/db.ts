import { connect, type Connection } from '@tidbcloud/serverless';

let cachedConnection: Connection<any> | null = null;

export function getDb() {
  if (cachedConnection) return cachedConnection;

  const url = process.env.TIDB_DATABASE_URL || process.env.DATABASE_URL;
  const host = process.env.TIDB_HOST || process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
  const username = process.env.TIDB_USER || process.env.DB_USERNAME || process.env.DB_USER || '3RbgZ6hjaMgBu6v.root';
  const password = process.env.TIDB_PASSWORD || process.env.DB_PASSWORD || 'EVHQahIcZPhNGKc2';
  const rawDb = process.env.TIDB_DATABASE || process.env.DB_DATABASE || 'test';
  // 'sys' is MySQL system diagnostic schema; user tables belong in 'test' or custom app database
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
