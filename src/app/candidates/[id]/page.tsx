import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CandidateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const candidate = await prisma.candidate.findUnique({
    where: { id: params.id },
  });

  if (!candidate) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">候補者詳細</h1>
        <div className="space-x-4">
          <Link
            href={`/candidates/${candidate.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            編集
          </Link>
          <Link
            href="/candidates"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            一覧に戻る
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">基本情報</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">名前</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {candidate.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {candidate.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">電話番号</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {candidate.phone}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  {
                    '応募': 'bg-blue-100 text-blue-800',
                    '書類選考': 'bg-yellow-100 text-yellow-800',
                    '一次面接': 'bg-purple-100 text-purple-800',
                    '二次面接': 'bg-indigo-100 text-indigo-800',
                    '最終面接': 'bg-pink-100 text-pink-800',
                    '内定': 'bg-green-100 text-green-800',
                    '保留': 'bg-gray-100 text-gray-800',
                    '不採用': 'bg-red-100 text-red-800'
                  }[candidate.status] || 'bg-gray-100 text-gray-800'
                }`}>
                  {candidate.status}
                </span>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">スコア</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {candidate.totalScore ? `${Math.round(candidate.totalScore)}点` : '-'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ランク</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  {
                    'A': 'bg-green-100 text-green-800',
                    'B': 'bg-yellow-100 text-yellow-800',
                    'C': 'bg-red-100 text-red-800'
                  }[candidate.rank || ''] || 'bg-gray-100 text-gray-800'
                }`}>
                  {candidate.rank || '-'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {candidate.resumeUrl && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">職務経歴書</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <Link
                href={candidate.resumeUrl}
                target="_blank"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                ファイルを表示
              </Link>
            </div>
          </div>
        </div>
      )}

      {candidate.resumeSummary && (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">職務経歴書の要約</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {candidate.resumeSummary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
