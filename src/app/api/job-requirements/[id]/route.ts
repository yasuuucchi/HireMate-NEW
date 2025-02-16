import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobRequirementSchema } from "@/lib/schema/job-requirements";
import { handlePrismaError } from "@/lib/prisma-errors";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobRequirement = await prisma.jobRequirement.findUnique({
      where: { id: params.id },
    });

    if (!jobRequirement) {
      return new NextResponse("採用要件が見つかりません", { status: 404 });
    }

    return NextResponse.json(jobRequirement);
  } catch (error) {
    console.error("Error fetching job requirement:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = jobRequirementSchema.parse(body);

    const jobRequirement = await prisma.jobRequirement.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(jobRequirement);
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.jobRequirement.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handlePrismaError(error);
  }
}
