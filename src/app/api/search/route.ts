import { NextRequest, NextResponse } from 'next/server';
import { searchPassages } from '@/lib/rag/search';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const corpus_type = searchParams.get('corpus_type') || undefined;
    const text_id = searchParams.get('text_id') || undefined;
    const concept_id = searchParams.get('concept_id') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const passages = searchPassages({
      query,
      corpus_type,
      text_id,
      concept_id,
      limit
    });

    return NextResponse.json({
      success: true,
      count: passages.length,
      data: passages
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ success: false, error: 'Search operation failed' }, { status: 500 });
  }
}
