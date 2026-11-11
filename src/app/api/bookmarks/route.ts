import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ bookmarks: [], notes: [] });
  }

  const db = getDb();
  const bookmarks = db.prepare('SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
  const notes = db.prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC').all(user.id);

  return NextResponse.json({ bookmarks, notes });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Please login to save bookmarks or notes' }, { status: 401 });
  }

  const db = getDb();
  const body = await req.json();
  const { type, item_id, title, note_content, passage_id } = body;

  if (type === 'bookmark') {
    const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND item_id = ?').get(user.id, item_id);
    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND item_id = ?').run(user.id, item_id);
      return NextResponse.json({ saved: false, message: 'Bookmark removed' });
    } else {
      db.prepare(`
        INSERT INTO bookmarks (id, user_id, item_type, item_id, title)
        VALUES (?, ?, 'passage', ?, ?)
      `).run(`bm-${Date.now()}`, user.id, item_id, title || 'Vedic Passage');
      return NextResponse.json({ saved: true, message: 'Bookmark saved' });
    }
  }

  if (type === 'note') {
    const existing = db.prepare('SELECT id FROM notes WHERE user_id = ? AND passage_id = ?').get(user.id, passage_id);
    if (existing) {
      db.prepare(`
        UPDATE notes
        SET note_content = ?, updated_at = datetime('now')
        WHERE user_id = ? AND passage_id = ?
      `).run(note_content, user.id, passage_id);
    } else {
      db.prepare(`
        INSERT INTO notes (id, user_id, passage_id, note_content)
        VALUES (?, ?, ?, ?)
      `).run(`note-${Date.now()}`, user.id, passage_id, note_content);
    }
    return NextResponse.json({ success: true, message: 'Note saved' });
  }

  return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
}
