import React, { useState } from 'react';
// Importing Icons
import { IoIosArrowDown } from 'react-icons/io';

type StepProofProps = {
  step: number;
  questions: string[];
  selectedQuestions: string[];
  answers: string[];
  onQuestionSelect: (questionIndex: number, step: number) => void;
  onAnswerChange: (answer: string, step: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
};

export default function StepProof({
  step,
  questions,
  selectedQuestions,
  answers,
  onQuestionSelect,
  onAnswerChange,
  onPrevStep,
  onNextStep,
}: StepProofProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableQuestions = questions.filter(
    (q) => !selectedQuestions.includes(q)
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-07 dark:text-03">
        Proof {step}
      </h3>
      <div className="relative">
        <div
          className="w-full p-3 bg-01 dark:bg-08 border border-04 dark:border-06 rounded-lg shadow-sm text-07 dark:text-03 cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedQuestions[step - 1] || 'Select a question'}</span>
          <IoIosArrowDown
            className={`transition-transform duration-300 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-01 dark:bg-08 border border-04 dark:border-06 rounded-lg shadow-lg max-h-60 overflow-auto">
            {availableQuestions.map((q, index) => (
              <div
                key={index}
                className="p-3 hover:bg-02 dark:hover:bg-07 cursor-pointer transition-colors duration-200"
                onClick={() => {
                  onQuestionSelect(index, step);
                  setIsOpen(false);
                }}
              >
                {q}
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedQuestions[step - 1] && (
        <input
          type="text"
          className="w-full p-3 bg-01 dark:bg-08 border border-04 dark:border-06 rounded-lg shadow-sm text-07 dark:text-03 focus:outline-none"
          placeholder="Your answer"
          value={answers[step - 1]}
          onChange={(e) => onAnswerChange(e.target.value, step)}
        />
      )}
      <div className="flex justify-between">
        <button
          onClick={onPrevStep}
          disabled={step === 1}
          className="px-4 py-2 bg-02 dark:bg-07 text-07 dark:text-03 rounded-lg disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNextStep}
          disabled={
            step === 3 || !selectedQuestions[step - 1] || !answers[step - 1]
          }
          className="px-4 py-2 bg-info text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          {step === 3 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}
