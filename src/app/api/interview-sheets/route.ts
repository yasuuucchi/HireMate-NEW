import { prisma } from '@/lib/prisma';
import { createInterviewSheetSchema } from '@/lib/schema/interview-sheets';
import { getPrismaErrorMessage } from '@/lib/prisma-errors';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

const interviewSheetInclude = {
  candidate: {
    select: {
      name: true,
    },
  },
  questions: true,
} as const;

// 面接シート一覧取得
export async function GET() {
  try {
    const interviewSheets = await prisma.interviewSheet.findMany({
      include: interviewSheetInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(interviewSheets);
  } catch (error) {
    console.error('Error fetching interview sheets:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: getPrismaErrorMessage(error.code) },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 面接シート新規作成
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = createInterviewSheetSchema.parse(data);

    // 候補者の存在確認
    const candidate = await prisma.candidate.findUnique({
      where: { id: validatedData.candidateId },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: '指定された候補者が見つかりません' },
        { status: 404 }
      );
    }

    // 面接シートの作成
    const interviewSheet = await prisma.interviewSheet.create({
      data: {
        candidateId: validatedData.candidateId,
        questions: {
          create: validatedData.questions.map((q) => ({
            text: q.text,
            goodAnswerExample: q.goodAnswerExample,
            badAnswerExample: q.badAnswerExample,
            order: q.order,
          })),
        },
      },
      include: interviewSheetInclude,
    });

    return NextResponse.json(interviewSheet);
  } catch (error: unknown) {
    console.error('Error creating interview sheet:', error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: '入力データが不正です', details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const message = getPrismaErrorMessage(error.code);
      console.error('Prisma error:', {
        code: error.code,
        message,
        meta: error.meta,
      });
      return NextResponse.json(
        { error: message, details: error.meta },
        { status: 400 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    console.error('Detailed error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
