import { NextRequest, NextResponse } from 'next/server';
import { processVedaVerseQuery } from '@/lib/rag/engine';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, conversationId, history } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const responseContract = await processVedaVerseQuery(question, history || []);

    // Persist conversation and message if user is authenticated or conversationId supplied
    try {
      const user = await getCurrentUser();
      const db = getDb();
      const convId = conversationId || `conv-${Date.now()}`;

      // Check if conversation exists
      const existingConv = db.prepare('SELECT id FROM conversations WHERE id = ?').get(convId);
      if (!existingConv) {
        db.prepare(`
          INSERT INTO conversations (id, user_id, title)
          VALUES (?, ?, ?)
        `).run(convId, user?.id || null, question.slice(0, 60));
      }

      // Insert message
      db.prepare(`
        INSERT INTO messages (id, conversation_id, sender, query_text, response_contract_json)
        VALUES (?, ?, 'assistant', ?, ?)
      `).run(`msg-${Date.now()}`, convId, question, JSON.stringify(responseContract));
    } catch {
      // Non-fatal if session is guest
    }

    return NextResponse.json({
      success: true,
      data: responseContract
    });
  } catch (error: any) {
    console.error('Ask VedaVerse API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'The explanation service is temporarily unavailable. All verified texts remain accessible in the library.'
      },
      { status: 500 }
    );
  }
}
