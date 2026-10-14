import { getDb } from './db.js';
import { hashPassword, verifyPassword, generateToken, verifyAdminRequest, verifyToken } from './authHelper.js';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getDb();
  if (!db) {
    return res.status(500).json({ error: 'Database connection unavailable' });
  }

  // Ensure table exists
  await db.execute(`
    CREATE TABLE IF NOT EXISTS security_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
      pin_hash VARCHAR(255) NULL,
      is_security_enabled BOOLEAN DEFAULT FALSE,
      admin_username VARCHAR(100) DEFAULT 'admin',
      admin_email VARCHAR(150) DEFAULT 'andrasyahdand@gmail.com',
      password_hash VARCHAR(255) NULL,
      password_salt VARCHAR(100) NULL,
      updated_at VARCHAR(50) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // GET: Check Auth Status
  if (req.method === 'GET') {
    try {
      const rows: any = await db.execute('SELECT * FROM security_settings WHERE id = "default" LIMIT 1');
      const settings = rows && rows.length > 0 ? rows[0] : null;

      const hasPassword = Boolean(settings && settings.password_hash);
      const isAuth = verifyAdminRequest(req);

      let user = null;
      if (isAuth && settings) {
        user = {
          username: settings.admin_username || 'admin',
          email: settings.admin_email || 'andrasyahdand@gmail.com',
        };
      }

      return res.status(200).json({
        authenticated: isAuth,
        isSetup: hasPassword,
        user,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: Auth Actions (login, setup, change-password, logout)
  if (req.method === 'POST') {
    const { action, identifier, password, username, email, currentPassword, newPassword } = req.body || {};

    try {
      const rows: any = await db.execute('SELECT * FROM security_settings WHERE id = "default" LIMIT 1');
      const settings = rows && rows.length > 0 ? rows[0] : null;

      // 1. Setup Initial Admin (If no password configured yet)
      if (action === 'setup') {
        if (settings && settings.password_hash) {
          return res.status(400).json({ error: 'Admin account has already been set up. Please login.' });
        }

        if (!password || password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        }

        const chosenUsername = (username || 'admin').trim().toLowerCase();
        const chosenEmail = (email || 'andrasyahdand@gmail.com').trim().toLowerCase();
        const { hash, salt } = hashPassword(password);

        await db.execute(
          `INSERT INTO security_settings (id, admin_username, admin_email, password_hash, password_salt, is_security_enabled, updated_at)
           VALUES ('default', ?, ?, ?, ?, 1, ?)
           ON DUPLICATE KEY UPDATE
             admin_username = VALUES(admin_username),
             admin_email = VALUES(admin_email),
             password_hash = VALUES(password_hash),
             password_salt = VALUES(password_salt),
             is_security_enabled = 1,
             updated_at = VALUES(updated_at)`,
          [chosenUsername, chosenEmail, hash, salt, new Date().toISOString()]
        );

        const token = generateToken({ username: chosenUsername, email: chosenEmail, role: 'admin' });
        res.setHeader(
          'Set-Cookie',
          `designlog_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
        );

        return res.status(200).json({
          success: true,
          message: 'Admin account successfully configured!',
          token,
          user: { username: chosenUsername, email: chosenEmail },
        });
      }

      // 2. Login
      if (action === 'login') {
        if (!settings || !settings.password_hash) {
          // If not configured, auto-setup with default if admin passes credentials
          return res.status(400).json({
            error: 'Belum ada akun Admin yang dikonfigurasi. Silakan buat password Admin terlebih dahulu.',
            needSetup: true,
          });
        }

        if (!identifier || !password) {
          return res.status(400).json({ error: 'Harap masukkan Username/Email dan Password.' });
        }

        const inputId = identifier.trim().toLowerCase();
        const storedUser = (settings.admin_username || 'admin').toLowerCase();
        const storedEmail = (settings.admin_email || 'andrasyahdand@gmail.com').toLowerCase();

        // Check if identifier matches username or email
        if (inputId !== storedUser && inputId !== storedEmail) {
          return res.status(401).json({ error: 'Username atau Email tidak ditemukan.' });
        }

        // Verify password
        const isValid = verifyPassword(password, settings.password_hash, settings.password_salt || '');
        if (!isValid) {
          return res.status(401).json({ error: 'Password yang Anda masukkan salah.' });
        }

        const token = generateToken({
          username: settings.admin_username || 'admin',
          email: settings.admin_email || 'andrasyahdand@gmail.com',
          role: 'admin',
        });

        res.setHeader(
          'Set-Cookie',
          `designlog_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
        );

        return res.status(200).json({
          success: true,
          message: 'Login berhasil!',
          token,
          user: {
            username: settings.admin_username || 'admin',
            email: settings.admin_email || 'andrasyahdand@gmail.com',
          },
        });
      }

      // 3. Change Password
      if (action === 'change-password') {
        if (!verifyAdminRequest(req)) {
          return res.status(401).json({ error: 'Unauthorized: Harap login terlebih dahulu.' });
        }

        if (!newPassword || newPassword.length < 6) {
          return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
        }

        if (settings && settings.password_hash) {
          const isValid = verifyPassword(currentPassword || '', settings.password_hash, settings.password_salt || '');
          if (!isValid) {
            return res.status(401).json({ error: 'Password lama salah.' });
          }
        }

        const { hash, salt } = hashPassword(newPassword);
        const nextUsername = username ? username.trim().toLowerCase() : (settings?.admin_username || 'admin');
        const nextEmail = email ? email.trim().toLowerCase() : (settings?.admin_email || 'andrasyahdand@gmail.com');

        await db.execute(
          `UPDATE security_settings 
           SET password_hash = ?, password_salt = ?, admin_username = ?, admin_email = ?, updated_at = ?
           WHERE id = 'default'`,
          [hash, salt, nextUsername, nextEmail, new Date().toISOString()]
        );

        const token = generateToken({ username: nextUsername, email: nextEmail, role: 'admin' });
        res.setHeader(
          'Set-Cookie',
          `designlog_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`
        );

        return res.status(200).json({
          success: true,
          message: 'Password Admin berhasil diperbarui!',
          token,
          user: { username: nextUsername, email: nextEmail },
        });
      }

      // 4. Logout
      if (action === 'logout') {
        res.setHeader('Set-Cookie', 'designlog_token=; Path=/; HttpOnly; Max-Age=0');
        return res.status(200).json({ success: true, message: 'Logout berhasil.' });
      }

      return res.status(400).json({ error: 'Invalid auth action' });
    } catch (err: any) {
      console.error('Auth error:', err);
      return res.status(500).json({ error: err.message || 'Authentication error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
