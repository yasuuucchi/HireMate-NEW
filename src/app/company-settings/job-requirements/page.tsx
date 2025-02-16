"use client";

import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";
import Link from "next/link";

interface JobRequirement {
  id: string;
  positionName: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  experienceYears: number;
  numberOfOpenings: number;
  employmentType: string;
  createdAt: string;
  updatedAt: string;
}

const columns: Column<JobRequirement>[] = [
  {
    header: "職種名",
    accessorKey: "positionName",
    cell: (info) => (
      <Link
        href={`/company-settings/job-requirements/${info.row.original.id}/edit`}
        className="text-blue-600 hover:text-blue-800"
      >
        {info.getValue()}
      </Link>
    ),
  },
  {
    header: "必須スキル",
    accessorKey: "requiredSkills",
    cell: (info) => (info.getValue() as string[]).join(", "),
  },
  {
    header: "歓迎スキル",
    accessorKey: "niceToHaveSkills",
    cell: (info) => (info.getValue() as string[]).join(", "),
  },
  {
    header: "経験年数",
    accessorKey: "experienceYears",
    cell: (info) => `${info.getValue()}年`,
  },
  {
    header: "募集人数",
    accessorKey: "numberOfOpenings",
    cell: (info) => `${info.getValue()}名`,
  },
  {
    header: "雇用形態",
    accessorKey: "employmentType",
  },
];

export default function JobRequirementsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">採用要件一覧</h1>
        <Link href="/company-settings/job-requirements/new">
          <Button>新規登録</Button>
        </Link>
      </div>

      <DataTable<JobRequirement>
        endpoint="/api/job-requirements"
        columns={columns}
      />
    </div>
  );
}
