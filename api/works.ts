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

function mapRowToWork(row: any) {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    hotelId: String(row.hotel_id || 'hotel_semarang'),
    periodId: String(row.period_id || 'period_2026_2'),
    categoryId: String(row.category_id || 'cat_social_media'),
    status: (row.status || 'final') as 'final' | 'revision' | 'in_review',
    description: String(row.description || ''),
    dateCertainty: (row.date_certainty || 'exact') as 'exact' | 'approximate',
    date: row.event_date ? String(row.event_date) : null,
    month: Number(row.event_month) || 10,
    year: Number(row.event_year) || 2026,
    revisionCount: Number(row.revision_count) || 1,
    dimensions: String(row.dimensions || '1080 × 1080 px'),
    colorSpace: String(row.color_space || 'RGB / DIGITAL'),
    aspectRatio: (row.aspect_ratio || '1:1') as '1:1' | '16:9' | '9:16' | '4:5' | 'A4' | 'custom',
    mediaType: (row.media_type || 'image') as 'image' | 'video',
    videoUri: row.video_uri ? String(row.video_uri) : undefined,
    duration: row.duration ? String(row.duration) : undefined,
    imageUri: String(row.image_uri || ''),
    draftImageUri: row.draft_image_uri ? String(row.draft_image_uri) : undefined,
    isUserCreated: Boolean(row.is_user_created),
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || new Date().toISOString()),
  };
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
    // 1. GET: Fetch all deliverables
    if (method === 'GET') {
      const rows = (await db.execute(
        'SELECT * FROM works ORDER BY created_at DESC'
      )) as any[];
      const data = (rows || []).map(mapRowToWork);
      return res.status(200).json(data);
    }

    // Server-side Admin Auth Guard for mutating operations
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      const isAuth = verifyAdminRequest(req);
      if (!isAuth) {
        try {
          const secRows: any = await db.execute('SELECT password_hash FROM security_settings WHERE id = "default" LIMIT 1');
          if (secRows && secRows.length > 0 && secRows[0].password_hash) {
            return res.status(401).json({
              error: 'UNAUTHORIZED',
              message: 'Akses ditolak: Harap login sebagai Admin untuk menambah atau mengubah data karya.',
            });
          }
        } catch {}
      }
    }

    // 2. POST: Create or Update Single Work
    if (method === 'POST') {
      const work = req.body;
      if (!work || !work.id || !work.title) {
        return res.status(400).json({ error: 'Missing required work fields' });
      }

      await db.execute(
        `INSERT INTO works (
          id, title, hotel_id, period_id, category_id, status, description,
          date_certainty, event_date, event_month, event_year, revision_count,
          dimensions, color_space, aspect_ratio, media_type, video_uri, duration,
          image_uri, draft_image_uri, is_user_created, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          hotel_id = VALUES(hotel_id),
          period_id = VALUES(period_id),
          category_id = VALUES(category_id),
          status = VALUES(status),
          description = VALUES(description),
          date_certainty = VALUES(date_certainty),
          event_date = VALUES(event_date),
          event_month = VALUES(event_month),
          event_year = VALUES(event_year),
          revision_count = VALUES(revision_count),
          dimensions = VALUES(dimensions),
          color_space = VALUES(color_space),
          aspect_ratio = VALUES(aspect_ratio),
          media_type = VALUES(media_type),
          video_uri = VALUES(video_uri),
          duration = VALUES(duration),
          image_uri = VALUES(image_uri),
          draft_image_uri = VALUES(draft_image_uri),
          is_user_created = VALUES(is_user_created),
          updated_at = VALUES(updated_at)`,
        [
          work.id,
          work.title,
          work.hotelId || 'hotel_semarang',
          work.periodId || 'period_2026_2',
          work.categoryId || 'cat_social_media',
          work.status || 'final',
          work.description || '',
          work.dateCertainty || 'exact',
          work.date || null,
          work.month || 10,
          work.year || 2026,
          work.revisionCount || 1,
          work.dimensions || '1080 × 1080 px',
          work.colorSpace || 'RGB / DIGITAL',
          work.aspectRatio || '1:1',
          work.mediaType || 'image',
          work.videoUri || null,
          work.duration || null,
          work.imageUri || '',
          work.draftImageUri || null,
          work.isUserCreated !== false,
          work.createdAt || new Date().toISOString(),
          new Date().toISOString(),
        ]
      );

      return res.status(200).json({ success: true, id: work.id });
    }

    // 3. PUT: Bulk Upsert Works (Non-destructive)
    if (method === 'PUT') {
      const { works } = req.body || {};
      if (!Array.isArray(works)) {
        return res.status(400).json({ error: 'Body must contain an array of works' });
      }

      for (const work of works) {
        await db.execute(
          `INSERT INTO works (
            id, title, hotel_id, period_id, category_id, status, description,
            date_certainty, event_date, event_month, event_year, revision_count,
            dimensions, color_space, aspect_ratio, media_type, video_uri, duration,
            image_uri, draft_image_uri, is_user_created, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            hotel_id = VALUES(hotel_id),
            period_id = VALUES(period_id),
            category_id = VALUES(category_id),
            status = VALUES(status),
            description = VALUES(description),
            date_certainty = VALUES(date_certainty),
            event_date = VALUES(event_date),
            event_month = VALUES(event_month),
            event_year = VALUES(event_year),
            revision_count = VALUES(revision_count),
            dimensions = VALUES(dimensions),
            color_space = VALUES(color_space),
            aspect_ratio = VALUES(aspect_ratio),
            media_type = VALUES(media_type),
            video_uri = VALUES(video_uri),
            duration = VALUES(duration),
            image_uri = VALUES(image_uri),
            draft_image_uri = VALUES(draft_image_uri),
            is_user_created = VALUES(is_user_created),
            updated_at = VALUES(updated_at)`,
          [
            work.id,
            work.title,
            work.hotelId || 'hotel_semarang',
            work.periodId || 'period_2026_2',
            work.categoryId || 'cat_social_media',
            work.status || 'final',
            work.description || '',
            work.dateCertainty || 'exact',
            work.date || null,
            work.month || 10,
            work.year || 2026,
            work.revisionCount || 1,
            work.dimensions || '1080 × 1080 px',
            work.colorSpace || 'RGB / DIGITAL',
            work.aspectRatio || '1:1',
            work.mediaType || 'image',
            work.videoUri || null,
            work.duration || null,
            work.imageUri || '',
            work.draftImageUri || null,
            work.isUserCreated !== false,
            work.createdAt || new Date().toISOString(),
            work.updatedAt || new Date().toISOString(),
          ]
        );
      }

      return res.status(200).json({ success: true, count: works.length });
    }

    // 4. DELETE: Delete single or all works
    if (method === 'DELETE') {
      const { id, all } = req.query || {};
      if (all === 'true') {
        await db.execute('DELETE FROM works');
        return res.status(200).json({ success: true, message: 'All works deleted' });
      }
      if (id) {
        await db.execute('DELETE FROM works WHERE id = ?', [String(id)]);
        return res.status(200).json({ success: true, deleted: id });
      }
      return res.status(400).json({ error: 'Missing id or all query parameter' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('API Error in /api/works:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
