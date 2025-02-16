import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 必須フィールドの検証
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // 候補者データの保存
    const candidate = await prisma.candidate.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        status: '応募', // デフォルトステータス
        skillScore: 0,
        cultureScore: 0,
        achievementScore: 0,
        potentialScore: 0,
        totalScore: 0,
        rank: 'C', // デフォルトランク
        resumeSummary: data.resumeSummary || '',
      },
    });

    // 非同期でスコアリングを実行（実際の実装では、ここでAIマイクロサービスを呼び出す）
    // この部分は、実際のAIマイクロサービスが実装された後に追加

    return NextResponse.json(
      {
        message: 'Candidate data received successfully',
        candidateId: candidate.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing candidate data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
