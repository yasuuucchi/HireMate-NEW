import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import CancelButton from '@/components/ui/CancelButton';

export default async function EditCustomStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const customStatus = await prisma.customStatus.findUnique({
    where: { id: params.id },
  });

  if (!customStatus) {
    notFound();
  }

  async function updateCustomStatus(formData: FormData) {
    'use server';

    const name = formData.get('name') as string;
    const order = parseInt(formData.get('order') as string);

    await prisma.customStatus.update({
      where: { id: params.id },
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
        <h1 className="text-2xl font-bold text-gray-900">ステータス編集</h1>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form action={updateCustomStatus}>
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
                    defaultValue={customStatus.name}
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
                    defaultValue={customStatus.order}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <CancelButton />
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
