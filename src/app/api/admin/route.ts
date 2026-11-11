import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== 'admin' && user.role !== 'scholar')) {
    return NextResponse.json({ error: 'Unauthorized. Admin or Scholar access required.' }, { status: 403 });
  }

  const db = getDb();

  // Knowledge gaps
  const gaps = db.prepare('SELECT * FROM knowledge_gaps ORDER BY created_at DESC LIMIT 50').all();

  // Statistics
  const passageCount = (db.prepare('SELECT count(*) as c FROM passages').get() as any)?.c || 0;
  const textCount = (db.prepare('SELECT count(*) as c FROM texts').get() as any)?.c || 0;
  const conceptCount = (db.prepare('SELECT count(*) as c FROM concepts').get() as any)?.c || 0;
  const userCount = (db.prepare('SELECT count(*) as c FROM users').get() as any)?.c || 0;
  const pendingGapsCount = (db.prepare("SELECT count(*) as c FROM knowledge_gaps WHERE status = 'pending_review'").get() as any)?.c || 0;

  // Recent audit logs
  const auditLogs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20').all();

  return NextResponse.json({
    success: true,
    stats: {
      passages: passageCount,
      texts: textCount,
      concepts: conceptCount,
      users: userCount,
      pendingGaps: pendingGapsCount
    },
    knowledgeGaps: gaps,
    auditLogs
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin privilege required.' }, { status: 403 });
  }

  const db = getDb();
  const body = await req.json();
  const { action, gapId, status, notes, passageId, newStatus } = body;

  if (action === 'update_gap') {
    db.prepare(`
      UPDATE knowledge_gaps
      SET status = ?, admin_notes = ?
      WHERE id = ?
    `).run(status, notes || '', gapId);

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, target_type, target_id, details_json)
      VALUES (?, ?, 'UPDATE_KNOWLEDGE_GAP', 'knowledge_gap', ?, ?)
    `).run(`audit-${Date.now()}`, user.id, gapId, JSON.stringify({ status, notes }));

    return NextResponse.json({ success: true, message: 'Knowledge gap status updated' });
  }

  if (action === 'update_passage_status') {
    db.prepare(`
      UPDATE passages
      SET verified_status = ?
      WHERE id = ?
    `).run(newStatus, passageId);

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, target_type, target_id, details_json)
      VALUES (?, ?, 'UPDATE_PASSAGE_STATUS', 'passage', ?, ?)
    `).run(`audit-${Date.now()}`, user.id, passageId, JSON.stringify({ newStatus }));

    return NextResponse.json({ success: true, message: 'Passage verification status updated' });
  }

  return NextResponse.json({ error: 'Unknown admin action' }, { status: 400 });
}
