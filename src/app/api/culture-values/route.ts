import { NextResponse } from "next/server"
import { cultureValueSchema } from "@/lib/schema/culture-values"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Request body:', body);

    // スキーマでバリデーションと変換を行う
    const validatedData = cultureValueSchema.parse(body)
    console.log('Validated data:', validatedData);

    const cultureValue = await prisma.cultureValue.create({
      data: validatedData,
    })
    console.log('Created culture value:', cultureValue);

    return NextResponse.json(
      { message: "カルチャー・バリューを登録しました", data: cultureValue },
      { status: 201 }
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
      { message: "登録に失敗しました" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cultureValues = await prisma.cultureValue.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(cultureValues)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "カルチャー・バリューの取得に失敗しました" },
      { status: 500 }
    )
  }
}
