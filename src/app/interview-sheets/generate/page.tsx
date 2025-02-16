'use client';

import React from 'react';
import { QuestionCard } from '@/components/ui/QuestionCard';
import { Button } from '@/components/ui/Button';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';

interface Question {
  text: string;
  good_answer_example: string;
  bad_answer_example: string;
}

interface GenerateQuestionsResponse {
  questions: Question[];
}

export default function GenerateQuestionsPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const { data: candidates } = useSWR('/api/candidates');

  const handleGenerate = async (candidateId: string) => {
    try {
      setIsGenerating(true);
      const candidate = candidates.find((c: any) => c.id === candidateId);
      
      const response = await fetch('http://localhost:8000/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_text: candidate.resumeSummary,
          culture_values_and_job_requirements: JSON.stringify({
            culture_values: [
              { title: 'イノベーション', importance: 90 },
              { title: 'チームワーク', importance: 85 },
            ],
            job_requirements: {
              positionName: '開発エンジニア',
              requiredSkills: ['TypeScript', 'React', 'Node.js'],
              niceToHaveSkills: ['AWS', 'Docker', 'Kubernetes'],
              experienceYears: 3,
            },
          }),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data: GenerateQuestionsResponse = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/interview-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: questions.map(q => ({
            text: q.text,
            goodAnswerExample: q.good_answer_example,
            badAnswerExample: q.bad_answer_example,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save interview sheet');
      }

      const data = await response.json();
      router.push(`/interview-sheets/${data.id}`);
    } catch (error) {
      console.error('Error saving interview sheet:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">面接質問生成</h1>

      <div className="mb-8">
        <select
          className="w-full max-w-xs p-2 border rounded"
          onChange={(e) => handleGenerate(e.target.value)}
          disabled={isGenerating}
        >
          <option value="">候補者を選択</option>
          {candidates?.map((candidate: any) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name}
            </option>
          ))}
        </select>
      </div>

      {isGenerating && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {questions.length > 0 && (
        <div>
          <div className="space-y-6 mb-8">
            {questions.map((question, index) => (
              <QuestionCard
                key={index}
                text={question.text}
                goodAnswerExample={question.good_answer_example}
                badAnswerExample={question.bad_answer_example}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>面接シートとして保存</Button>
          </div>
        </div>
      )}
    </div>
  );
}
