import React from 'react';
import { cn } from '@/lib/utils';

interface AnswerCardProps {
  type: 'good' | 'bad';
  title: string;
  content: string;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  type,
  title,
  content,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg p-4',
        type === 'good'
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'
      )}
    >
      <h4
        className={cn(
          'font-semibold mb-2',
          type === 'good' ? 'text-green-700' : 'text-red-700'
        )}
      >
        {title}
      </h4>
      <p
        className={cn(
          'text-sm',
          type === 'good' ? 'text-green-600' : 'text-red-600'
        )}
      >
        {content}
      </p>
    </div>
  );
};
