import { NextResponse } from "next/server"
import { evaluationWeightSchema } from "@/lib/schema/evaluation-weights"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"

export async function GET() {
  try {
    // 最初のレコードを取得（存在しない場合はデフォルト値を返す）
    let weights = await prisma.evaluationWeights.findFirst({
      orderBy: { createdAt: "desc" },
    })

    if (!weights) {
      // デフォルト値で新しいレコードを作成
      weights = await prisma.evaluationWeights.create({
        data: {
          skillWeight: 25,
          cultureWeight: 25,
          achievementWeight: 25,
          potentialWeight: 25,
        }
      })
    }

    return NextResponse.json(weights)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "評価基準の重みの取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    console.log('Request body:', body);

    // スキーマでバリデーションと変換を行う
    const validatedData = evaluationWeightSchema.parse(body)
    console.log('Validated data:', validatedData);

    // 既存のレコードを取得
    const existingWeights = await prisma.evaluationWeights.findFirst({
      orderBy: { createdAt: "desc" },
    })

    let weights
    if (existingWeights) {
      // 既存のレコードを更新
      weights = await prisma.evaluationWeights.update({
        where: { id: existingWeights.id },
        data: validatedData,
      })
    } else {
      // 新規レコードを作成
      weights = await prisma.evaluationWeights.create({
        data: validatedData,
      })
    }

    console.log('Updated weights:', weights);

    return NextResponse.json(
      { message: "評価基準の重みを更新しました", data: weights },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error details:", error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          message: "入力データが不正です",
          errors: error.errors.map(e => ({
            path: e.path.join("."),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "更新に失敗しました" },
      { status: 500 }
    )
  }
}
