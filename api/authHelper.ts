import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || 'designlog-v2-super-secure-token-secret-2026';

export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const hashedAttempt = crypto.scryptSync(password, salt, 64).toString('hex');
    const attemptBuf = Buffer.from(hashedAttempt, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (attemptBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(attemptBuf, storedBuf);
  } catch {
    return false;
  }
}

export function generateToken(payload: { username: string; email: string; role: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  const data = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${data}`).digest('base64url');
  return `${header}.${data}.${signature}`;
}

export function verifyToken(token: string): { valid: boolean; payload?: any } {
  if (!token || typeof token !== 'string') return { valid: false };
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false };

  const [header, data, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(`${header}.${data}`).digest('base64url');

  if (signature.length !== expectedSig.length) return { valid: false };
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return { valid: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false }; // Expired
    }
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export function verifyAdminRequest(req: any): boolean {
  // 1. Check Authorization: Bearer <token>
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const result = verifyToken(token);
    if (result.valid) return true;
  }

  // 2. Check Cookie designlog_token
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader && typeof cookieHeader === 'string') {
    const match = cookieHeader.match(/designlog_token=([^;]+)/);
    if (match) {
      const token = match[1].trim();
      const result = verifyToken(token);
      if (result.valid) return true;
    }
  }

  return false;
}
