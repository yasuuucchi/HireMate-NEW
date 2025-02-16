'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInterviewSheetSchema } from '@/lib/schema/interview-sheets';
import type { CreateInterviewSheet } from '@/lib/schema/interview-sheets';

interface Candidate {
  id: string;
  name: string;
}

export default function NewInterviewSheetPage() {
  const router = useRouter();
  const { data: candidates } = useSWR<Candidate[]>('/api/candidates');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateInterviewSheet>({
    resolver: zodResolver(createInterviewSheetSchema),
    defaultValues: {
      questions: [
        {
          text: '',
          goodAnswerExample: '',
          badAnswerExample: '',
          order: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: CreateInterviewSheet) => {
    try {
      const response = await fetch('/api/interview-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('面接シートの作成に失敗しました');
      }

      router.push('/interview-sheets');
    } catch (error) {
      console.error('Error creating interview sheet:', error);
      alert('面接シートの作成に失敗しました');
    }
  };

  if (!candidates) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">面接シート作成</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            候補者
          </label>
          <select
            {...register('candidateId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">選択してください</option>
            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}
              </option>
            ))}
          </select>
          {errors.candidateId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.candidateId.message}
            </p>
          )}
        </div>

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
              className="p-4 bg-white rounded-lg shadow space-y-4"
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
  );
}
