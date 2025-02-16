'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateInterviewSheetSchema } from '@/lib/schema/interview-sheets';
import type { UpdateInterviewSheet } from '@/lib/schema/interview-sheets';

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

export default function EditInterviewSheetPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: sheet, error } = useSWR<InterviewSheet>(
    `/api/interview-sheets/${params.id}`
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateInterviewSheet>({
    resolver: zodResolver(updateInterviewSheetSchema),
    defaultValues: {
      questions: sheet?.questions.map((q) => ({
        text: q.text,
        goodAnswerExample: q.goodAnswerExample,
        badAnswerExample: q.badAnswerExample,
        order: q.order,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: UpdateInterviewSheet) => {
    try {
      const response = await fetch(`/api/interview-sheets/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('面接シートの更新に失敗しました');
      }

      router.push(`/interview-sheets/${params.id}`);
    } catch (error) {
      console.error('Error updating interview sheet:', error);
      alert('面接シートの更新に失敗しました');
    }
  };

  if (error) {
    return <div>データの取得に失敗しました</div>;
  }

  if (!sheet) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">面接シート編集</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">基本情報</h2>
          <dl className="mt-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">候補者名</dt>
              <dd className="mt-1 text-sm text-gray-900">{sheet.candidate.name}</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">質問リスト</h2>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  append({
                    text: '',
                    goodAnswerExample: '',
                    badAnswerExample: '',
                    order: fields.length,
                  })
                }
              >
                質問を追加
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 bg-gray-50 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900">
                    質問 {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      削除
                    </Button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    質問文
                  </label>
                  <input
                    type="text"
                    {...register(`questions.${index}.text`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.questions?.[index]?.text && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.questions[index]?.text?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    良い回答例
                  </label>
                  <textarea
                    {...register(`questions.${index}.goodAnswerExample`)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.questions?.[index]?.goodAnswerExample && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.questions[index]?.goodAnswerExample?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    悪い回答例
                  </label>
                  <textarea
                    {...register(`questions.${index}.badAnswerExample`)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                  {errors.questions?.[index]?.badAnswerExample && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.questions[index]?.badAnswerExample?.message}
                    </p>
                  )}
                </div>

                <input
                  type="hidden"
                  {...register(`questions.${index}.order`)}
                  value={index}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              保存
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
