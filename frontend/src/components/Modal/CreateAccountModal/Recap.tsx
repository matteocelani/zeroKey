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
      <h3 className="text-xl font-semibold text-07 dark:text-03 border-b border-04 dark:border-06 pb-2">
        Review Your Account
      </h3>

      <div className="space-y-6">
        <section>
          <h4 className="font-medium text-06 dark:text-04 mb-3">
            Security Questions:
          </h4>
          {selectedQuestions.map((q, index) => (
            <div key={index} className="bg-02 dark:bg-08 p-4 rounded-lg mb-3">
              <p className="text-sm font-medium text-07 dark:text-03 mb-1">
                Q: {SECURITY_QUESTIONS[parseInt(q)]}
              </p>
              <p className="text-sm text-06 dark:text-04">
                A: {answers[index]}
              </p>
            </div>
          ))}
        </section>

        {ensName && (
          <section>
            <h4 className="font-medium text-06 dark:text-04 mb-2">ENS Name:</h4>
            <div className="bg-02 dark:bg-08 p-3 rounded-lg">
              <p className="text-sm text-07 dark:text-03">{ensName}</p>
            </div>
          </section>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t border-04 dark:border-06">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-03 dark:bg-07 text-07 dark:text-03 rounded-lg transition-colors hover:bg-04 dark:hover:bg-06"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-2 bg-success text-white rounded-lg transition-colors hover:bg-success/90"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
