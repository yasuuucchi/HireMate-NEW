'use client';

import { Button } from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface InterviewSheet {
  id: string;
  candidateId: string;
  createdAt: string;
  updatedAt: string;
  candidate: {
    name: string;
  };
  questions: Array<{
    id: string;
    text: string;
    goodAnswerExample: string;
    badAnswerExample: string;
    order: number;
  }>;
}

export default function InterviewSheetsPage() {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('この面接シートを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/interview-sheets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      // 一覧を再読み込み
      window.location.reload();
    } catch (error) {
      console.error('Error deleting interview sheet:', error);
      alert('削除に失敗しました');
    }
  };

  const columns: Column<InterviewSheet>[] = [
    {
      header: '候補者名',
      accessorKey: 'candidate',
      cell: ({ getValue }) => {
        const candidate = getValue() as { name: string };
        return candidate.name;
      },
    },
    {
      header: '質問数',
      accessorKey: 'questions',
      cell: ({ getValue }) => {
        const questions = getValue() as any[];
        return questions.length;
      },
    },
    {
      header: '作成日時',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => {
        return new Date(getValue() as string).toLocaleString();
      },
    },
    {
      header: '更新日時',
      accessorKey: 'updatedAt',
      cell: ({ getValue }) => {
        return new Date(getValue() as string).toLocaleString();
      },
    },
    {
      header: '操作',
      accessorKey: 'id',
      cell: ({ getValue }) => {
        const id = getValue() as string;
        return (
          <div className="flex justify-end space-x-2">
            <Link href={`/interview-sheets/${id}`}>
              <Button variant="secondary" size="sm">
                詳細
              </Button>
            </Link>
            <Link href={`/interview-sheets/${id}/edit`}>
              <Button variant="secondary" size="sm">
                編集
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(id)}
            >
              削除
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">面接シート一覧</h1>
        <Link href="/interview-sheets/new">
          <Button variant="primary">
            新規作成
          </Button>
        </Link>
      </div>

      <DataTable
        endpoint="/api/interview-sheets"
        columns={columns}
      />
    </div>
  );
}
