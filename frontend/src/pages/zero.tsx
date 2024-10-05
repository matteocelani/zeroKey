import React, { useState } from 'react';
// Importing Icons
import { CgSpinner } from 'react-icons/cg';
// Importing Components
import Meta from '@/components/Meta';
import StepProof from '@/components/StepProof';
import SendInterface from '@/components/SendInterface';
import RecoverInterface from '@/components/RecoverInterface';
// Importing Utils
import { isValidAddress } from '@/lib/utils/addressUtils';

export default function Zero() {
  const [activeTab, setActiveTab] = useState('send');
  const [step, setStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [proofString, setProofString] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    if (newAddress && !isValidAddress(newAddress)) {
      setAddressError('Please enter a valid Ethereum address or ENS domain');
    } else {
      setAddressError('');
    }
  };

  const handleQuestionSelect = (questionIndex: number, currentStep: number) => {
    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[currentStep - 1] = questionIndex.toString();
    setSelectedQuestions(newSelectedQuestions);
  };

  const handleAnswerChange = (answer: string, currentStep: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = answer;
    setAnswers(newAnswers);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleTabChange = (newTab: 'send' | 'recovery') => {
    if (proofGenerated) {
      setActiveTab(newTab);
    } else {
      setActiveTab(newTab);
      setStep(0);
      setAddress('');
      setSelectedQuestions([]);
      setAnswers(['', '', '']);
      setProofGenerated(false);
    }
  };

  const handleGenerateProof = () => {
    setIsGeneratingProof(true);
    // Simulating proof generation
    setTimeout(() => {
      const newProofString = selectedQuestions
        .map((q, i) => `${q}:${answers[i]}`)
        .join(';');
      setProofString(newProofString);
      setIsGeneratingProof(false);
      setProofGenerated(true);
    }, 3000); // 3 seconds simulation
  };

  const renderAddressInput = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-07 dark:text-03">
        Enter Ethereum Address or ENS Domain
      </h3>
      <div>
        <input
          type="text"
          className={`w-full p-3 bg-01 dark:bg-08 border ${
            addressError ? 'border-danger' : 'border-04 dark:border-06'
          } rounded-lg shadow-sm text-07 dark:text-03 focus:outline-none`}
          placeholder="0x...abc or example.eth"
          value={address}
          onChange={handleAddressChange}
        />
        {addressError && (
          <p className="mt-2 text-sm text-danger">{addressError}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setStep(1)}
          disabled={!address || !!addressError}
          className="px-4 py-2 bg-info text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isGeneratingProof) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <CgSpinner className="w-16 h-16 animate-spin"></CgSpinner>
          <p className="text-07 dark:text-03">Generating Proof...</p>
        </div>
      );
    }

    if (proofGenerated) {
      return activeTab === 'send' ? (
        <SendInterface address={address} proofString={proofString} />
      ) : (
        <RecoverInterface address={address} proofString={proofString} />
      );
    }

    if (step === 0) {
      return renderAddressInput();
    }

    return (
      <StepProof
        step={step}
        selectedQuestions={selectedQuestions}
        answers={answers}
        onQuestionSelect={handleQuestionSelect}
        onAnswerChange={handleAnswerChange}
        onPrevStep={handlePrevStep}
        onNextStep={handleNextStep}
        onFinish={handleGenerateProof}
      />
    );
  };

  return (
    <>
      <Meta />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl xs:text-2xl s:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-warning to-danger text-transparent bg-clip-text">
          Secure Transactions & Recovery
        </h1>

        <div className="flex justify-center mb-8">
          <div className="bg-02 dark:bg-07 rounded-lg p-1 flex w-full max-w-xs">
            <button
              onClick={() => handleTabChange('send')}
              className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'send'
                  ? 'bg-info text-white shadow-lg'
                  : 'text-07 dark:text-03 hover:bg-03 dark:hover:bg-06'
              }`}
            >
              Send
            </button>
            <button
              onClick={() => handleTabChange('recovery')}
              className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'recovery'
                  ? 'bg-info text-white shadow-lg'
                  : 'text-07 dark:text-03 hover:bg-03 dark:hover:bg-06'
              }`}
            >
              Recovery
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-02 dark:bg-08 rounded-lg shadow-lg p-6 md:p-8 transition-all duration-300">
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-07 dark:text-03">
              {activeTab === 'send' ? 'Send Funds' : 'Recover Smart Account'}
            </h2>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
