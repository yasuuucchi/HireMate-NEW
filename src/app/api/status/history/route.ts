import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// バリデーションスキーマ
const statusHistorySchema = z.object({
  candidateId: z.string().min(1, '候補者IDは必須です'),
  status: z.string().min(1, 'ステータスは必須です'),
  note: z.string().optional(),
});

// ステータス履歴の作成
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationResult = statusHistorySchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: '入力内容に誤りがあります' },
        { status: 400 }
      );
    }

    // ステータス履歴の作成
    const statusHistory = await prisma.statusHistory.create({
      data: validationResult.data,
    });

    // 候補者のステータスも更新
    await prisma.candidate.update({
      where: { id: data.candidateId },
      data: { status: data.status },
    });

    return NextResponse.json({
      success: true,
      data: statusHistory,
      message: 'ステータスを更新しました',
    });
  } catch (error) {
    console.error('Error creating status history:', error);
    return NextResponse.json(
      { error: 'ステータスの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// 特定の候補者のステータス履歴を取得
export async function GET(
  request: Request,
  { params }: { params: { candidateId: string } }
) {
  try {
    const statusHistory = await prisma.statusHistory.findMany({
      where: { candidateId: params.candidateId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: statusHistory,
    });
  } catch (error) {
    console.error('Error fetching status history:', error);
    return NextResponse.json(
      { error: 'ステータス履歴の取得に失敗しました' },
      { status: 500 }
    );
  }
}
