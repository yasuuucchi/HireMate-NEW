'use client';

import Link from 'next/link';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: keyof typeof statusStyles;
  totalScore: number | null;
  rank: keyof typeof rankStyles | null;
}

const statusStyles: { [key: string]: string } = {
  '応募': 'bg-blue-100 text-blue-800',
  '書類選考': 'bg-yellow-100 text-yellow-800',
  '一次面接': 'bg-purple-100 text-purple-800',
  '二次面接': 'bg-indigo-100 text-indigo-800',
  '最終面接': 'bg-pink-100 text-pink-800',
  '内定': 'bg-green-100 text-green-800',
  '保留': 'bg-gray-100 text-gray-800',
  '不採用': 'bg-red-100 text-red-800'
};

const rankStyles: { [key: string]: string } = {
  'A': 'bg-green-100 text-green-800',
  'B': 'bg-yellow-100 text-yellow-800',
  'C': 'bg-red-100 text-red-800'
};

export default function CandidatesPage() {
  const columns: Column<Candidate>[] = [
    {
      header: '名前',
      accessorKey: 'name',
    },
    {
      header: 'メールアドレス',
      accessorKey: 'email',
    },
    {
      header: '電話番号',
      accessorKey: 'phone',
    },
    {
      header: 'ステータス',
      accessorKey: 'status',
      cell: ({ getValue }: { getValue: () => string }) => {
        const status = getValue() as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: 'スコア',
      accessorKey: 'totalScore',
      cell: ({ getValue }: { getValue: () => number | null }) => {
        const score = getValue() as number;
        return score ? `${Math.round(score)}点` : '-';
      },
    },
    {
      header: 'ランク',
      accessorKey: 'rank',
      cell: ({ getValue }: { getValue: () => string | null }) => {
        const rank = getValue() as string;
        return rank ? (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${rankStyles[rank] || 'bg-gray-100 text-gray-800'}`}>
            {rank}
          </span>
        ) : '-';
      },
    },
    {
      header: '操作',
      accessorKey: 'id',
      cell: ({ getValue }: { getValue: () => string }) => {
        const id = getValue() as string;
        return (
          <div className="flex space-x-2">
            <Link
              href={`/candidates/${id}`}
              className="text-primary hover:text-primary-light font-medium"
            >
              詳細
            </Link>
            <Link
              href={`/candidates/${id}/edit`}
              className="text-primary hover:text-primary-light font-medium"
            >
              編集
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">候補者一覧</h1>
        <Link href="/candidates/new">
          <Button variant="primary">
            新規登録
          </Button>
        </Link>
      </div>

      <DataTable
        endpoint="/api/candidates"
        columns={columns}
      />
    </div>
  );
}
