import { prisma } from '@/lib/prisma';
import { CustomStatus, standardStatuses } from '@/lib/schema/status';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function StatusSettingsPage() {
  const customStatuses = await prisma.customStatus.findMany({
    orderBy: { order: 'asc' },
  }) as CustomStatus[];

  async function deleteCustomStatus(formData: FormData) {
    'use server';

    const id = formData.get('id') as string;
    await prisma.customStatus.delete({
      where: { id },
    });

    revalidatePath('/company-settings/status');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ステータス設定</h1>
        <Link
          href="/company-settings/status/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          新規ステータス追加
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">標準ステータス</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            システムで定義された標準的なステータスです
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {standardStatuses.map((status) => (
              <li key={status} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">{status}</div>
                  <div className="text-sm text-gray-500">標準</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">カスタムステータス</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            追加で定義されたステータスです
          </p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {customStatuses.map((status) => (
              <li key={status.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">{status.name}</div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">順序: {status.order}</div>
                    <Link
                      href={`/company-settings/status/${status.id}/edit`}
                      className="text-primary hover:text-primary-light"
                    >
                      編集
                    </Link>
                    <form action={deleteCustomStatus} className="inline">
                      <input type="hidden" name="id" value={status.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-800"
                      >
                        削除
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
            {customStatuses.length === 0 && (
              <li className="px-4 py-4 sm:px-6">
                <div className="text-sm text-gray-500">
                  カスタムステータスはまだ登録されていません
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
