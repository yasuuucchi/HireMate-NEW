import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobRequirementSchema } from "@/lib/schema/job-requirements";
import { handlePrismaError } from "@/lib/prisma-errors";

export async function GET() {
  try {
    const jobRequirements = await prisma.jobRequirement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobRequirements);
  } catch (error) {
    console.error("Error fetching job requirements:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = jobRequirementSchema.parse(body);

    const jobRequirement = await prisma.jobRequirement.create({
      data: validatedData,
    });

    return NextResponse.json(jobRequirement, { status: 201 });
  } catch (error) {
    return handlePrismaError(error);
  }
}
