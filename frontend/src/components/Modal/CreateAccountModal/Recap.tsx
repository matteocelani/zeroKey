import React from 'react';
import { SECURITY_QUESTIONS } from '@/lib/constants/questions';

type RecapProps = {
  selectedQuestions: string[];
  answers: string[];
  ensName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Recap({
  selectedQuestions,
  answers,
  ensName,
  onConfirm,
  onCancel,
}: RecapProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-07 dark:text-03">
        Review Your Choices
      </h3>
      <div className="space-y-4">
        <h4 className="font-medium text-06 dark:text-04">Security Questions:</h4>
        {selectedQuestions.map((q, index) => (
          <div key={index} className="text-sm text-07 dark:text-03">
            <p>Q: {SECURITY_QUESTIONS[parseInt(q)]}</p>
            <p>A: {answers[index]}</p>
          </div>
        ))}
        {ensName && (
          <div className="text-sm text-07 dark:text-03">
            <h4 className="font-medium text-06 dark:text-04">ENS Name:</h4>
            <p>{ensName}</p>
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-03 dark:bg-07 text-07 dark:text-03 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-success text-white rounded-lg transition-colors"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
