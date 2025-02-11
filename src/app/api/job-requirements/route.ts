import { NextResponse } from "next/server"
import { jobRequirementSchema } from "@/lib/schema/job-requirements"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Request body:', body);

    // スキーマでバリデーションと変換を行う
    const validatedData = jobRequirementSchema.parse(body)
    console.log('Validated data:', validatedData);

    const jobRequirement = await prisma.jobRequirement.create({
      data: validatedData,
    })
    console.log('Created job requirement:', jobRequirement);

    return NextResponse.json(
      { message: "採用要件を登録しました", data: jobRequirement },
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
    const jobRequirements = await prisma.jobRequirement.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(jobRequirements)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "採用要件の取得に失敗しました" },
      { status: 500 }
    )
  }
}
