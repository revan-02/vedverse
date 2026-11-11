import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, comparePassword, createSessionToken, getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, name } = body;
    const db = getDb();

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out' });
      response.cookies.delete('veda_token');
      return response;
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }

      const userRow = db.prepare('SELECT id, email, password_hash, name, role FROM users WHERE email = ?').get(email.toLowerCase()) as any;
      if (!userRow) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const isValid = await comparePassword(password, userRow.password_hash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      const session = {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name,
        role: userRow.role
      };

      const token = await createSessionToken(session);
      const response = NextResponse.json({ success: true, user: session });
      response.cookies.set('veda_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    }

    if (action === 'register') {
      if (!email || !password || !name) {
        return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });
      }

      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
      if (existing) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      const newId = `usr-${Date.now()}`;

      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role)
        VALUES (?, ?, ?, ?, 'user')
      `).run(newId, email.toLowerCase(), passwordHash, name);

      const session = {
        id: newId,
        email: email.toLowerCase(),
        name,
        role: 'user' as const
      };

      const token = await createSessionToken(session);
      const response = NextResponse.json({ success: true, user: session });
      response.cookies.set('veda_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Auth API error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
