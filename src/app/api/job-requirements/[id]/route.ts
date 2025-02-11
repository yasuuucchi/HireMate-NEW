import { NextResponse } from "next/server"
import { jobRequirementSchema } from "@/lib/schema/job-requirements"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const jobRequirement = await prisma.jobRequirement.findUnique({
      where: { id },
    })

    if (!jobRequirement) {
      return NextResponse.json(
        { message: "採用要件が見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(jobRequirement)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "採用要件の取得に失敗しました" },
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
    const validatedData = jobRequirementSchema.parse(body)

    const jobRequirement = await prisma.jobRequirement.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(
      { message: "採用要件を更新しました" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "採用要件が見つかりません" },
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

    await prisma.jobRequirement.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "採用要件を削除しました" },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)
    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "採用要件が見つかりません" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "削除に失敗しました" },
      { status: 500 }
    )
  }
}
