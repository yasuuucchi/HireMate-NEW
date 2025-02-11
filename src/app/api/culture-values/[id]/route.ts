import { NextResponse } from "next/server"
import { cultureValueSchema } from "@/lib/schema/culture-values"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const cultureValue = await prisma.cultureValue.findUnique({
      where: { id },
    })

    if (!cultureValue) {
      return NextResponse.json(
        { message: "カルチャー・バリューが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(cultureValue)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "カルチャー・バリューの取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const validatedData = cultureValueSchema.parse(body)

    const cultureValue = await prisma.cultureValue.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(
      { message: "カルチャー・バリューを更新しました" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "カルチャー・バリューが見つかりません" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "更新に失敗しました" },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.cultureValue.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "カルチャー・バリューを削除しました" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "カルチャー・バリューが見つかりません" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "削除に失敗しました" },
      { status: 500 }
    )
  }
}
