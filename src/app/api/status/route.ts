import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// バリデーションスキーマ
const customStatusSchema = z.object({
  name: z.string().min(1, 'ステータス名を入力してください'),
  order: z.number().int().min(0),
});

// カスタムステータスの作成
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validationResult = customStatusSchema.safeParse(data);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: '入力内容に誤りがあります' },
        { status: 400 }
      );
    }

    const customStatus = await prisma.customStatus.create({
      data: validationResult.data,
    });

    return NextResponse.json({
      success: true,
      data: customStatus,
      message: 'カスタムステータスを作成しました',
    });
  } catch (error) {
    console.error('Error creating custom status:', error);
    return NextResponse.json(
      { error: 'カスタムステータスの作成に失敗しました' },
      { status: 500 }
    );
  }
}

// カスタムステータスの一覧取得
export async function GET() {
  try {
    const customStatuses = await prisma.customStatus.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: customStatuses,
    });
  } catch (error) {
    console.error('Error fetching custom statuses:', error);
    return NextResponse.json(
      { error: 'カスタムステータスの取得に失敗しました' },
      { status: 500 }
    );
  }
}
