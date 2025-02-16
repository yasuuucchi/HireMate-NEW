import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { standardStatuses } from '@/lib/schema/candidates';
import Link from 'next/link';

export default async function EditCandidatePage({
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
        <h1 className="text-2xl font-bold text-gray-900">候補者編集</h1>
        <Link
          href={`/candidates/${candidate.id}`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          詳細に戻る
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-8">
        <form action={`/api/candidates/${candidate.id}`} method="PUT" className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={candidate.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={candidate.email}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              電話番号
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={candidate.phone}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              id="status"
              name="status"
              defaultValue={candidate.status}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              {standardStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Link
              href={`/candidates/${candidate.id}`}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
