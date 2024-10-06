// SetupZeroKeyModal.tsx
import React, { useState } from 'react';
import StepProof from '@/components/StepProof';
import Recap from '@/components/Recap';

type SetupZeroKeyModalProps = {
  onClose: () => void;
};

export default function SetupZeroKeyModal({ onClose }: SetupZeroKeyModalProps) {
  const [step, setStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleQuestionSelect = (questionIndex: number, stepNumber: number) => {
    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[stepNumber - 1] = questionIndex.toString();
    setSelectedQuestions(newSelectedQuestions);
  };

  const handleAnswerChange = (answer: string, stepNumber: number) => {
    const newAnswers = [...answers];
    newAnswers[stepNumber - 1] = answer;
    setAnswers(newAnswers);
  };

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  const handleFinishProof = () => {
    setStep(4); // Move to the recap step
  };

  const handleConfirm = () => {
    console.log('ZeroKey setup completed', { selectedQuestions, answers });
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-09 bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-01 dark:bg-09 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-07 dark:text-02">
            Setup ZeroKey
          </h2>
          <button
            onClick={onClose}
            className="text-06 hover:text-07 dark:text-04 dark:hover:text-02"
          >
            ✕
          </button>
        </div>

        {step <= 3 ? (
          <StepProof
            step={step}
            selectedQuestions={selectedQuestions}
            answers={answers}
            onQuestionSelect={handleQuestionSelect}
            onAnswerChange={handleAnswerChange}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            onFinish={handleFinishProof}
          />
        ) : (
          <Recap
            selectedQuestions={selectedQuestions}
            answers={answers}
            onConfirm={handleConfirm}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
}
