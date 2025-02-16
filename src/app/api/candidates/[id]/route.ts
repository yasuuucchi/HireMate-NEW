import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { candidateSchema, candidateFormSchema } from '@/lib/schema/candidates';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // データベースの更新
    const candidate = await prisma.candidate.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    return NextResponse.json({
      success: true,
      candidate,
      message: '候補者情報を更新しました',
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json(
      { error: '候補者情報の更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.candidate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: '候補者を削除しました',
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { error: '候補者の削除に失敗しました' },
      { status: 500 }
    );
  }
}
