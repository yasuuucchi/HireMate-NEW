import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 必須フィールドの検証
    if (!data.candidateId) {
      return NextResponse.json(
        { error: 'Candidate ID is required' },
        { status: 400 }
      );
    }

    // 候補者データの取得
    const candidate = await prisma.candidate.findUnique({
      where: { id: data.candidateId },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    // スコアデータを返却
    return NextResponse.json({
      candidateId: candidate.id,
      scores: {
        skill: candidate.skillScore,
        culture: candidate.cultureScore,
        achievement: candidate.achievementScore,
        potential: candidate.potentialScore,
        total: candidate.totalScore,
      },
      rank: candidate.rank,
      status: candidate.status,
    });
  } catch (error) {
    console.error('Error retrieving candidate score:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
