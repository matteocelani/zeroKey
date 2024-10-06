import React, { useState } from 'react';
// Importing Hooks
import { useAccount, useConnectorClient } from 'wagmi';
// Importing Utils
import { SafeManager } from '@/lib/utils/safeManager';
import { generateHash } from '@/lib/utils/secretUtils';
import { serializeQuestionsAndAnswers } from '@/lib/utils/secretUtils';
// Importing Constants
import { SECURITY_QUESTIONS } from '@/lib/constants/questions';
// Importing Toast
import { toast } from 'sonner';

type RecapProps = {
  selectedQuestions: string[];
  answers: string[];
  onConfirm: () => void;
  onCancel: () => void;
  safeAddress: string;
};

export default function Recap({
  selectedQuestions,
  answers,
  onConfirm,
  onCancel,
  safeAddress,
}: RecapProps) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const { data: connectorClient } = useConnectorClient();

  const createSmartAccount = async () => {
    if (!address || !connectorClient) {
      setError('Wallet not connected');
      toast.error('Wallet not connected', {
        className:
          'bg-red-100 text-red-800 border-l-4 border-red-500 rounded-md',
      });
      return;
    }

    setIsCreatingAccount(true);
    setError(null);

    const pendingToastId = toast.loading('Creating smart account...', {
      className:
        'bg-blue-100 text-blue-800 border-l-4 border-blue-500 rounded-md',
    });

    try {
      const serialized = serializeQuestionsAndAnswers(
        selectedQuestions,
        answers
      );
      const hash = generateHash(serialized);

      // Initialize Safe manager
      const safeManager = new SafeManager();
      await safeManager.initializeWallet(safeAddress, connectorClient);

      // Create transaction to add secret
      await safeManager.addSecret(safeAddress, hash);

      toast.dismiss(pendingToastId);
      toast.success('Smart account created successfully!', {
        className:
          'bg-green-100 text-green-800 border-l-4 border-green-500 rounded-md',
      });
      onConfirm();
    } catch (err) {
      console.error(
        'Error creating smart account or sending transaction:',
        err
      );
      setError(
        'Failed to create smart account or send transaction. Please try again.'
      );
      toast.dismiss(pendingToastId);
      toast.error('Failed to create smart account. Please try again.', {
        className:
          'bg-red-100 text-red-800 border-l-4 border-red-500 rounded-md',
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

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
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      <div className="flex justify-between pt-4 border-t border-04 dark:border-06">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-03 dark:bg-07 text-07 dark:text-03 rounded-lg transition-colors hover:bg-04 dark:hover:bg-06"
          disabled={isCreatingAccount}
        >
          Cancel
        </button>
        <button
          onClick={createSmartAccount}
          className="px-6 py-2 bg-success text-white rounded-lg transition-colors hover:bg-success/90"
          disabled={isCreatingAccount}
        >
          {isCreatingAccount ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}
