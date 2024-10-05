import React, { useState, useEffect } from 'react';
// Importing Hooks
import { useEnsAddress, useEnsName, useAccount } from 'wagmi';
// Importing Icons
import { CgSpinner } from 'react-icons/cg';
import { MdDone, MdClose } from 'react-icons/md';
// Importing Components
import Meta from '@/components/Meta';
import StepProof from '@/components/StepProof';
import SendInterface from '@/components/SendInterface';
import RecoverInterface from '@/components/RecoverInterface';
// Importing Utils
import { isValidAddress } from '@/lib/utils/addressUtils';
import {
  generateProof,
  serializeQuestionsAndAnswers,
} from '@/lib/utils/secretUtils';

export default function Zero() {
  const { address: adr } = useAccount();

  const [activeTab, setActiveTab] = useState('send');
  const [step, setStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [proofString, setProofString] = useState('');
  const [address, setAddress] = useState('');
  const [isValidRecipient, setIsValidRecipient] = useState(false);
  const [isCheckingENS, setIsCheckingENS] = useState(false);
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);

  const lowerCaseAddress = address.toLowerCase();

  const { data: ensAddress, isLoading: isLoadingEnsAddress } = useEnsAddress({
    name: lowerCaseAddress.includes('.') ? lowerCaseAddress : undefined,
    chainId: 1, // Mainnet for ENS resolution
  });

  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address: isValidAddress(lowerCaseAddress)
      ? (lowerCaseAddress as `0x${string}`)
      : undefined,
    chainId: 1, // Mainnet for ENS resolution
  });

  useEffect(() => {
    const isValidEthAddress = isValidAddress(lowerCaseAddress);
    const isValidEns =
      lowerCaseAddress.includes('.') && lowerCaseAddress.length > 3;
    const isResolved = Boolean(ensAddress) || Boolean(ensName);

    setIsValidRecipient(isValidEthAddress || (isValidEns && isResolved));
    setIsCheckingENS(isLoadingEnsAddress || isLoadingEnsName);
  }, [
    lowerCaseAddress,
    ensAddress,
    ensName,
    isLoadingEnsAddress,
    isLoadingEnsName,
  ]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
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

  const handleGenerateProof = async () => {
    setIsGeneratingProof(true);
    if (!adr) {
      console.error('No account found');
      setIsGeneratingProof(false);
      return;
    }
    try {
      const concatenated = serializeQuestionsAndAnswers(
        selectedQuestions,
        answers
      );
      const proof = await generateProof(concatenated, adr);
      console.log('Generated proof:', proof);
      setProofString(JSON.stringify(proof)); // Assuming you want to store the proof as a string
      setProofGenerated(true);
    } catch (error) {
      console.error('Error generating proof:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsGeneratingProof(false);
    }
  };

  const renderAddressInput = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-07 dark:text-03">
        Enter Ethereum Address or ENS Domain
      </h3>
      <div className="relative">
        <input
          type="text"
          className={`w-full p-3 pr-10 bg-01 dark:bg-08 border ${
            isValidRecipient ? 'border-success' : 'border-04 dark:border-06'
          } rounded-lg shadow-sm text-07 dark:text-03 focus:outline-none`}
          placeholder="0x...abc or example.eth"
          value={address}
          onChange={handleAddressChange}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isCheckingENS && (
            <CgSpinner className="animate-spin h-5 w-5 text-06" />
          )}
          {!isCheckingENS && isValidRecipient && (
            <MdDone className="h-5 w-5 text-success" />
          )}
          {!isCheckingENS && !isValidRecipient && address && (
            <MdClose className="h-5 w-5 text-danger" />
          )}
        </div>
      </div>
      {ensAddress && (
        <div className="text-xs text-success mt-1">Resolved: {ensAddress}</div>
      )}
      {ensName && (
        <div className="text-xs text-success mt-1">Resolved: {ensName}</div>
      )}
      <div className="flex justify-end">
        <button
          onClick={() => setStep(1)}
          disabled={!isValidRecipient}
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
      const resolvedAddress = ensAddress || address;
      return activeTab === 'send' ? (
        <SendInterface address={resolvedAddress} proofString={proofString} />
      ) : (
        <RecoverInterface address={resolvedAddress} proofString={proofString} />
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
        isRecover
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
