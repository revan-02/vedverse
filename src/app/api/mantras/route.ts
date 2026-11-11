import { NextResponse } from 'next/server';
import { getDbMantras } from '@/lib/db/repository';

export async function GET() {
  try {
    const mantras = await getDbMantras();

    return NextResponse.json({
      success: true,
      data: {
        mantras
      }
    });
  } catch (error: any) {
    console.error('Error fetching mantras:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mantras' },
      { status: 500 }
    );
  }
}
