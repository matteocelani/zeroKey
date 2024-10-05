import React, { useState } from 'react';
import StepProof from '@/components/StepProof';
import SetupENS from '@/components/SetupENS';
import Recap from './Recap';

type CreateAccountModalProps = {
  onClose: () => void;
};

export default function CreateAccountModal({ onClose }: CreateAccountModalProps) {
  const [step, setStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [ensName, setEnsName] = useState('');

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
    // Move to ENS setup step
    setStep(4);
  };

  const handleSkipENS = () => {
    // Move to recap step
    setStep(5);
  };

  const handleSetENS = (name: string) => {
    setEnsName(name);
    setStep(5);
  };

  const handleCreateAccount = () => {
    // Implement account creation logic here
    console.log('Creating account with:', { selectedQuestions, answers, ensName });
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-01 dark:bg-09 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-07 dark:text-02">
            Create Smart Account
          </h2>
          <button
            onClick={onClose}
            className="text-06 hover:text-07 dark:text-04 dark:hover:text-02"
          >
            ✕
          </button>
        </div>

        {step <= 3 && (
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
        )}

        {step === 4 && (
          <SetupENS
            onSkip={handleSkipENS}
            onSetENS={handleSetENS}
          />
        )}

        {step === 5 && (
          <Recap
            selectedQuestions={selectedQuestions}
            answers={answers}
            ensName={ensName}
            onConfirm={handleCreateAccount}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
}
