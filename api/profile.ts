import { connect, type Connection } from '@tidbcloud/serverless';
import { verifyAdminRequest } from './authHelper.js';

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
    return res.status(503).json({
      error: 'DATABASE_UNCONFIGURED',
      message: 'TiDB is not configured. Falling back to client local storage.',
    });
  }

  const method = req.method?.toUpperCase();

  try {
    if (method === 'GET') {
      const rows = (await db.execute(
        "SELECT * FROM user_profile WHERE id = 'default' LIMIT 1"
      )) as any[];

      if (rows && rows.length > 0) {
        const row = rows[0];
        return res.status(200).json({
          name: row.name,
          role: row.role,
          institution: row.institution,
          faculty: row.faculty,
          company: row.company,
          cohort: row.cohort,
          avatar: row.avatar,
          cluster: row.cluster,
          specialization: row.specialization,
          supervisor: row.supervisor,
          email: row.email,
          phone: row.phone,
          bio: row.bio,
        });
      }

      return res.status(404).json({ error: 'Profile not found' });
    }

    if (method === 'POST') {
      const isAuth = verifyAdminRequest(req);
      if (!isAuth) {
        try {
          const secRows: any = await db.execute('SELECT password_hash FROM security_settings WHERE id = "default" LIMIT 1');
          if (secRows && secRows.length > 0 && secRows[0].password_hash) {
            return res.status(401).json({
              error: 'UNAUTHORIZED',
              message: 'Akses ditolak: Harap login sebagai Admin untuk mengubah profil.',
            });
          }
        } catch {}
      }

      const p = req.body;
      if (!p || !p.name) {
        return res.status(400).json({ error: 'Invalid profile data' });
      }

      await db.execute(
        `INSERT INTO user_profile (
          id, name, role, institution, faculty, company, cohort,
          avatar, cluster, specialization, supervisor, email, phone, bio, updated_at
        ) VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          role = VALUES(role),
          institution = VALUES(institution),
          faculty = VALUES(faculty),
          company = VALUES(company),
          cohort = VALUES(cohort),
          avatar = VALUES(avatar),
          cluster = VALUES(cluster),
          specialization = VALUES(specialization),
          supervisor = VALUES(supervisor),
          email = VALUES(email),
          phone = VALUES(phone),
          bio = VALUES(bio),
          updated_at = NOW()`,
        [
          p.name,
          p.role,
          p.institution,
          p.faculty,
          p.company,
          p.cohort,
          p.avatar,
          p.cluster,
          p.specialization,
          p.supervisor,
          p.email || '',
          p.phone || '',
          p.bio || '',
        ]
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('API Error in /api/profile:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
