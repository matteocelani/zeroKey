import React, { useState, useEffect } from 'react';
// Importing Components
import Meta from '@/components/Meta';
import StepProof from '@/components/StepProof';

export default function Zero() {
  const [activeTab, setActiveTab] = useState('send');
  const [step, setStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    fetch('/data/questions.json')
      .then((response) => response.json())
      .then((data) => setQuestions(data.questions));
  }, []);

  const handleQuestionSelect = (questionIndex: number, step: number) => {
    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[step - 1] = questions[questionIndex];
    setSelectedQuestions(newSelectedQuestions);
  };

  const handleAnswerChange = (answer: string, step: number) => {
    const newAnswers = [...answers];
    newAnswers[step - 1] = answer;
    setAnswers(newAnswers);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'send') {
      console.log('Performing send transaction');
      // Add send transaction logic here
    } else {
      console.log('Performing recovery transaction');
      // Add recovery transaction logic here
    }
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
              onClick={() => setActiveTab('send')}
              className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'send'
                  ? 'bg-info text-white shadow-lg'
                  : 'text-07 dark:text-03 hover:bg-03 dark:hover:bg-06'
              }`}
            >
              Send
            </button>
            <button
              onClick={() => setActiveTab('recovery')}
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
            <StepProof
              step={step}
              questions={questions}
              selectedQuestions={selectedQuestions}
              answers={answers}
              onQuestionSelect={handleQuestionSelect}
              onAnswerChange={handleAnswerChange}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
            />
            {step === 3 && (
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 bg-success text-white rounded-lg transition-colors"
              >
                {activeTab === 'send' ? 'Send Transaction' : 'Recover Account'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
