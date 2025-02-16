'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

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

export default function InterviewSheetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: sheet, error } = useSWR<InterviewSheet>(
    `/api/interview-sheets/${params.id}`
  );

  if (error) {
    return <div>データの取得に失敗しました</div>;
  }

  if (!sheet) {
    return <div>読み込み中...</div>;
  }

  const handleDelete = async () => {
    if (!confirm('この面接シートを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/interview-sheets/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      router.push('/interview-sheets');
    } catch (error) {
      console.error('Error deleting interview sheet:', error);
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">面接シート詳細</h1>
        <div className="space-x-4">
          <Button
            variant="secondary"
            onClick={() => router.push(`/interview-sheets/${params.id}/edit`)}
          >
            編集
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            削除
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">基本情報</h2>
          <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">候補者名</dt>
              <dd className="mt-1 text-sm text-gray-900">{sheet.candidate.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">作成日時</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(sheet.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">更新日時</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(sheet.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">質問リスト</h2>
          <div className="space-y-6">
            {sheet.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-gray-50 rounded-lg p-4 space-y-4"
              >
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    質問 {index + 1}
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">{question.text}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-green-600">良い回答例</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {question.goodAnswerExample}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-red-600">悪い回答例</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {question.badAnswerExample}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => router.push('/interview-sheets')}>
          一覧に戻る
        </Button>
      </div>
    </div>
  );
}
