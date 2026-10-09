import { getDb } from './db';

function mapRowToTask(row: any) {
  let revisions = [];
  if (row.revisions) {
    if (typeof row.revisions === 'string') {
      try {
        revisions = JSON.parse(row.revisions);
      } catch {
        revisions = [];
      }
    } else if (Array.isArray(row.revisions)) {
      revisions = row.revisions;
    }
  }

  return {
    id: String(row.id),
    title: String(row.title || ''),
    department: (row.department || 'fnb') as any,
    requesterName: String(row.requester_name || ''),
    requesterContact: row.requester_contact ? String(row.requester_contact) : undefined,
    hotelId: String(row.hotel_id || 'hotel_semarang'),
    mediaType: (row.media_type || 'image') as 'image' | 'video',
    targetOutput: String(row.target_output || 'Standing Banner'),
    targetDimensions: row.target_dimensions ? String(row.target_dimensions) : undefined,
    priority: (row.priority || 'urgent') as any,
    status: (row.status || 'backlog') as any,
    deadline: String(row.deadline || '2026-10-12'),
    description: String(row.description || ''),
    referenceUrl: row.reference_url ? String(row.reference_url) : undefined,
    convertedWorkId: row.converted_work_id ? String(row.converted_work_id) : undefined,
    completedAt: row.completed_at ? String(row.completed_at) : undefined,
    revisions: Array.isArray(revisions) ? revisions : [],
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
    // 1. GET: Fetch all tasks
    if (method === 'GET') {
      const rows = (await db.execute(
        'SELECT * FROM tasks ORDER BY created_at DESC'
      )) as any[];
      const data = (rows || []).map(mapRowToTask);
      return res.status(200).json(data);
    }

    // 2. POST: Create or Update Single Task
    if (method === 'POST') {
      const task = req.body;
      if (!task || !task.id || !task.title) {
        return res.status(400).json({ error: 'Missing required task fields' });
      }

      const revisionsJson = JSON.stringify(task.revisions || []);

      await db.execute(
        `INSERT INTO tasks (
          id, title, department, requester_name, requester_contact, hotel_id,
          media_type, target_output, target_dimensions, priority, status,
          deadline, description, reference_url, converted_work_id, completed_at,
          revisions, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          department = VALUES(department),
          requester_name = VALUES(requester_name),
          requester_contact = VALUES(requester_contact),
          hotel_id = VALUES(hotel_id),
          media_type = VALUES(media_type),
          target_output = VALUES(target_output),
          target_dimensions = VALUES(target_dimensions),
          priority = VALUES(priority),
          status = VALUES(status),
          deadline = VALUES(deadline),
          description = VALUES(description),
          reference_url = VALUES(reference_url),
          converted_work_id = VALUES(converted_work_id),
          completed_at = VALUES(completed_at),
          revisions = VALUES(revisions),
          updated_at = VALUES(updated_at)`,
        [
          task.id,
          task.title,
          task.department || 'fnb',
          task.requesterName || '',
          task.requesterContact || null,
          task.hotelId || 'hotel_semarang',
          task.mediaType || 'image',
          task.targetOutput || 'Standing Banner',
          task.targetDimensions || null,
          task.priority || 'urgent',
          task.status || 'backlog',
          task.deadline || '2026-10-12',
          task.description || '',
          task.referenceUrl || null,
          task.convertedWorkId || null,
          task.completedAt || null,
          revisionsJson,
          task.createdAt || new Date().toISOString(),
          new Date().toISOString(),
        ]
      );

      return res.status(200).json({ success: true, id: task.id });
    }

    // 3. PUT: Bulk Sync / Replace All Tasks
    if (method === 'PUT') {
      const { tasks } = req.body || {};
      if (!Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Body must contain an array of tasks' });
      }

      await db.execute('DELETE FROM tasks');

      for (const task of tasks) {
        const revisionsJson = JSON.stringify(task.revisions || []);
        await db.execute(
          `INSERT INTO tasks (
            id, title, department, requester_name, requester_contact, hotel_id,
            media_type, target_output, target_dimensions, priority, status,
            deadline, description, reference_url, converted_work_id, completed_at,
            revisions, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            task.id,
            task.title,
            task.department || 'fnb',
            task.requesterName || '',
            task.requesterContact || null,
            task.hotelId || 'hotel_semarang',
            task.mediaType || 'image',
            task.targetOutput || 'Standing Banner',
            task.targetDimensions || null,
            task.priority || 'urgent',
            task.status || 'backlog',
            task.deadline || '2026-10-12',
            task.description || '',
            task.referenceUrl || null,
            task.convertedWorkId || null,
            task.completedAt || null,
            revisionsJson,
            task.createdAt || new Date().toISOString(),
            task.updatedAt || new Date().toISOString(),
          ]
        );
      }

      return res.status(200).json({ success: true, count: tasks.length });
    }

    // 4. DELETE: Delete single or all tasks
    if (method === 'DELETE') {
      const { id, all } = req.query || {};
      if (all === 'true') {
        await db.execute('DELETE FROM tasks');
        return res.status(200).json({ success: true, message: 'All tasks deleted' });
      }
      if (id) {
        await db.execute('DELETE FROM tasks WHERE id = ?', [String(id)]);
        return res.status(200).json({ success: true, deleted: id });
      }
      return res.status(400).json({ error: 'Missing id or all query parameter' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('API Error in /api/tasks:', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
}
