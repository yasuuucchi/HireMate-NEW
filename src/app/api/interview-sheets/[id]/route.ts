import { prisma } from '@/lib/prisma';
import { updateInterviewSheetSchema } from '@/lib/schema/interview-sheets';
import { getPrismaErrorMessage } from '@/lib/prisma-errors';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { UpdateInterviewSheet } from '@/lib/schema/interview-sheets';
import { ZodError } from 'zod';

type InterviewSheetWithQuestions = {
  id: string;
  candidateId: string;
  createdAt: Date;
  updatedAt: Date;
  candidate: {
    name: string;
  };
  questions: Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    text: string;
    goodAnswerExample: string;
    badAnswerExample: string;
    rating: number | null;
    note: string | null;
    interviewSheetId: string;
    order: number;
  }>;
};

const interviewSheetSelect = {
  id: true,
  candidateId: true,
  createdAt: true,
  updatedAt: true,
  candidate: {
    select: {
      name: true,
    },
  },
  questions: {
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      text: true,
      goodAnswerExample: true,
      badAnswerExample: true,
      rating: true,
      note: true,
      interviewSheetId: true,
      order: true,
    },
  },
} as const;

// 面接シート詳細取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const interviewSheet = await prisma.interviewSheet.findUnique({
      where: { id: params.id },
      select: interviewSheetSelect,
    });

    if (!interviewSheet) {
      return NextResponse.json(
        { error: '面接シートが見つかりません' },
        { status: 404 }
      );
    }

    const response: InterviewSheetWithQuestions = {
      ...interviewSheet,
      questions: interviewSheet.questions.sort((a, b) => a.order - b.order),
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching interview sheet:', error);
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

// 面接シート更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validatedData = updateInterviewSheetSchema.parse(data);

    // 面接シートの存在確認
    const existingSheet = await prisma.interviewSheet.findUnique({
      where: { id: params.id },
      select: interviewSheetSelect,
    });

    if (!existingSheet) {
      return NextResponse.json(
        { error: '面接シートが見つかりません' },
        { status: 404 }
      );
    }

    // トランザクションで面接シートと質問を更新
    const updatedSheet = await prisma.$transaction(async (tx) => {
      // 既存の質問を削除
      await tx.interviewSheet.update({
        where: { id: params.id },
        data: {
          questions: {
            deleteMany: {},
          },
        },
      });

      // 新しい質問を作成
      const sheet = await tx.interviewSheet.update({
        where: { id: params.id },
        data: {
          questions: {
            create: validatedData.questions.map((q) => ({
              text: q.text,
              goodAnswerExample: q.goodAnswerExample,
              badAnswerExample: q.badAnswerExample,
              order: q.order,
            })),
          },
        },
        select: interviewSheetSelect,
      });

      const response: InterviewSheetWithQuestions = {
        ...sheet,
        questions: sheet.questions.sort((a, b) => a.order - b.order),
      };
      return response;
    });

    return NextResponse.json(updatedSheet);
  } catch (error: unknown) {
    console.error('Error updating interview sheet:', error);
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

// 面接シート削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingSheet = await prisma.interviewSheet.findUnique({
      where: { id: params.id },
    });

    if (!existingSheet) {
      return NextResponse.json(
        { error: '面接シートが見つかりません' },
        { status: 404 }
      );
    }

    await prisma.interviewSheet.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { success: true, message: '面接シートを削除しました' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting interview sheet:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: getPrismaErrorMessage(error.code) },
        { status: 400 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
