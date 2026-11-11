import { NextResponse } from 'next/server';
import { getDbCosmologicalPassages, getDbSubjectCorrelations } from '@/lib/db/repository';

export async function GET() {
  try {
    const [passages, subjectCorrelations] = await Promise.all([
      getDbCosmologicalPassages(),
      getDbSubjectCorrelations()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        passages,
        subjectCorrelations
      }
    });
  } catch (error: any) {
    console.error('Error fetching universe data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch universe cosmology data' },
      { status: 500 }
    );
  }
}
