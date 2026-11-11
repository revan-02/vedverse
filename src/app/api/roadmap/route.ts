import { NextResponse } from 'next/server';
import { getDbRoadmapMilestones } from '@/lib/db/repository';

export async function GET() {
  try {
    const milestones = await getDbRoadmapMilestones();

    return NextResponse.json({
      success: true,
      data: {
        milestones
      }
    });
  } catch (error: any) {
    console.error('Error fetching roadmap data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch roadmap data' },
      { status: 500 }
    );
  }
}
