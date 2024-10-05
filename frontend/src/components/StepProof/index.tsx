import React, { useState } from 'react';
// Importing Icons
import { IoIosArrowDown } from 'react-icons/io';
// Importing Constants
import { SECURITY_QUESTIONS } from '@/lib/constants/questions';

type StepProofProps = {
  step: number;
  selectedQuestions: string[];
  answers: string[];
  onQuestionSelect: (questionIndex: number, step: number) => void;
  onAnswerChange: (answer: string, step: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onFinish: () => void;
  isRecover?: boolean;
};

export default function StepProof({
  step,
  selectedQuestions,
  answers,
  onQuestionSelect,
  onAnswerChange,
  onPrevStep,
  onNextStep,
  onFinish,
  isRecover = false,
}: StepProofProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableQuestions = SECURITY_QUESTIONS.filter(
    (_, index) => !selectedQuestions.includes(index.toString())
  );

  const handleNextOrFinish = () => {
    if (step === 3) {
      onFinish();
    } else {
      onNextStep();
    }
  };

  const adjustedStep = isRecover ? step : step;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-07 dark:text-03">
        Proof {adjustedStep}
      </h3>
      <div className="relative">
        <div
          className="w-full p-3 bg-01 dark:bg-08 border border-04 dark:border-06 rounded-lg shadow-sm text-07 dark:text-03 cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {selectedQuestions[step - 1]
              ? SECURITY_QUESTIONS[parseInt(selectedQuestions[step - 1])]
              : 'Select a question'}
          </span>
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
                  onQuestionSelect(SECURITY_QUESTIONS.indexOf(q), step);
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
        {(isRecover || step > 1) && (
          <button
            onClick={onPrevStep}
            className="px-4 py-2 bg-03 dark:bg-07 text-07 dark:text-03 rounded-lg transition-colors"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleNextOrFinish}
          disabled={!selectedQuestions[step - 1] || !answers[step - 1]}
          className={`px-4 py-2 bg-info text-white rounded-lg disabled:opacity-50 transition-colors ${
            isRecover || step > 1 ? '' : 'ml-auto'
          }`}
        >
          {step === 3
            ? isRecover
              ? 'Generate the Proof'
              : 'Generate Secret'
            : 'Next'}
        </button>
      </div>
    </div>
  );
}
