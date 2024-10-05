import React, { useEffect, useRef, useState } from 'react';
import StepProof from '@/components/StepProof';
import SetupENS from '@/components/SetupENS';
import Recap from '@/components/Recap';

enum CreateAccountStep {
  Proof1 = 1,
  Proof2,
  Proof3,
  SetupENS,
  Review,
}

const stepTitles: Record<CreateAccountStep, string> = {
  [CreateAccountStep.Proof1]: 'Proof 1',
  [CreateAccountStep.Proof2]: 'Proof 2',
  [CreateAccountStep.Proof3]: 'Proof 3',
  [CreateAccountStep.SetupENS]: 'Setup ENS',
  [CreateAccountStep.Review]: 'Review',
};

type CreateAccountModalProps = {
  onClose: () => void;
};

export default function CreateAccountModal({
  onClose,
}: CreateAccountModalProps) {
  const [step, setStep] = useState<CreateAccountStep>(CreateAccountStep.Proof1);
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

  const handleNextStep = () => setStep((step + 1) as CreateAccountStep);
  const handlePrevStep = () => setStep((step - 1) as CreateAccountStep);

  const handleFinishProof = () => {
    setStep(CreateAccountStep.SetupENS);
  };

  const handleSkipENS = () => {
    setStep(CreateAccountStep.Review);
  };

  const handleSetENS = (name: string) => {
    setEnsName(name);
    setStep(CreateAccountStep.Review);
  };

  const handleCreateAccount = () => {
    console.log('Creating account with:', {
      selectedQuestions,
      answers,
      ensName,
    });
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [step]);

  const renderStepIndicator = () => {
    return (
      <div className="mb-6 relative px-2">
        <div className="mx-4 absolute top-2 left-2 right-2 h-0.5 bg-04">
          <div
            className="h-full bg-success transition-all duration-300 ease-in-out"
            style={{
              width: `${((step - 1) / (Object.keys(CreateAccountStep).length / 2 - 1)) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between items-center relative">
          {Object.values(CreateAccountStep)
            .filter((s) => typeof s === 'number')
            .map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    s <= step ? 'bg-success' : 'bg-04'
                  } z-10`}
                />
                <span className="text-xs mt-1 text-06">
                  {stepTitles[s as CreateAccountStep]}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-09 bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-01 dark:bg-09 rounded-lg w-full max-w-md h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex-shrink-0">
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
          {renderStepIndicator()}
        </div>

        <div 
          ref={contentRef}
          className="flex-grow overflow-y-auto px-6 pb-6"
        >
          {step <= CreateAccountStep.Proof3 && (
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

          {step === CreateAccountStep.SetupENS && (
            <SetupENS onSkip={handleSkipENS} onSetENS={handleSetENS} isDeploy />
          )}

          {step === CreateAccountStep.Review && (
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
    </div>
  );
}
