import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { candidateSchema, candidateFormSchema } from '@/lib/schema/candidates';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const status = formData.get('status') as string;
    const resumeUrl = formData.get('resumeUrl') as string;
    
    const data = {
      name: name,
      email: email,
      phone: phone,
      status: status,
      resumeUrl: resumeUrl,
    };

    // バリデーション
    const validationResult = candidateSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: '入力内容に誤りがあります' },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.create({
      data: validationResult.data,
    });

    return NextResponse.json({
      success: true,
      candidate,
      message: '候補者を登録しました',
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { error: '候補者の登録に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(candidates);
  } catch (error) {
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
