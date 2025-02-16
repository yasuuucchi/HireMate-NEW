import React from 'react';
import { AnswerCard } from './AnswerCard';

interface QuestionCardProps {
  text: string;
  goodAnswerExample: string;
  badAnswerExample: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  text,
  goodAnswerExample,
  badAnswerExample,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{text}</h3>
      <div className="space-y-4">
        <AnswerCard
          type="good"
          title="理想的な回答例"
          content={goodAnswerExample}
        />
        <AnswerCard
          type="bad"
          title="低評価な回答例"
          content={badAnswerExample}
        />
      </div>
    </div>
  );
};
