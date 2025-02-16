import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default function NewCustomStatusPage() {
  async function createCustomStatus(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const order = parseInt(formData.get('order') as string);

    await prisma.customStatus.create({
      data: {
        name,
        order,
      },
    });

    redirect('/company-settings/status');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">新規ステータス追加</h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form action={createCustomStatus}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  ステータス名
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="order"
                  className="block text-sm font-medium text-gray-700"
                >
                  表示順序
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="order"
                    id="order"
                    required
                    min="0"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  保存
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
