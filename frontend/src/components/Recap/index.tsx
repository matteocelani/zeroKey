import React, { useState } from 'react';
// Importing Hooks
import { useAccount, useClient, useConnectorClient } from 'wagmi';
// Importing Utils
import { ethers } from 'ethers';
import { http, parseEther } from 'viem';
import { base } from 'viem/chains';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { entryPoint07Address } from 'viem/account-abstraction';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { createSmartAccountClient } from 'permissionless';
import { generateHash } from '@/lib/utils/secretUtils';
import { serializeQuestionsAndAnswers } from '@/lib/utils/secretUtils';
// Importing Constants
import { SECURITY_QUESTIONS } from '@/lib/constants/questions';
import { ZERO_CONTRACT_ADDRESS } from '@/lib/constants';

type RecapProps = {
  selectedQuestions: string[];
  answers: string[];
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Recap({
  selectedQuestions,
  answers,
  onConfirm,
  onCancel,
}: RecapProps) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const client = useClient();
  const { data: connectorClient } = useConnectorClient();

  const createSmartAccount = async () => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsCreatingAccount(true);
    setError(null);

    try {
      const pimlicoApiKey = process.env.NEXT_PUBLIC_PIMLICO_KEY;
      if (!pimlicoApiKey) {
        throw new Error('Pimlico API key not found');
      }

      const serialized = serializeQuestionsAndAnswers(
        selectedQuestions,
        answers
      );
      const hash = generateHash(serialized);

      const paymasterClient = createPimlicoClient({
        transport: http(
          `https://api.pimlico.io/v2/base/rpc?apikey=${pimlicoApiKey}`
        ),
        entryPoint: {
          address: entryPoint07Address,
          version: '0.7',
        },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      if (!connectorClient) {
        throw new Error('Wallet client not found');
      }

      const safeAccount = await toSafeSmartAccount({
        client: client,
        entryPoint: {
          address: entryPoint07Address,
          version: '0.7',
        },
        // @ts-expect-error - Viem type not return a Eip1193Provider
        owners: [connectorClient],
        saltNonce: BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
        version: '1.4.1',
      });

      const smartAccountClient = createSmartAccountClient({
        account: safeAccount,
        chain: base,
        paymaster: paymasterClient,
        bundlerTransport: http(
          `https://api.pimlico.io/v2/base/rpc?apikey=${pimlicoApiKey}`
        ),
        userOperation: {
          estimateFeesPerGas: async () =>
            (await paymasterClient.getUserOperationGasPrice()).fast,
        },
      });

      const iface = new ethers.Interface([
        'function enableModule(address module) public',
        'function setHash(bytes32 hash) external',
      ]);

      // Send a transaction to register the account on the blockchain
      await smartAccountClient.sendUserOperation({
        calls: [
          {
            to: smartAccountClient.account.address,
            value: parseEther('0'),
            data: iface.encodeFunctionData('enableModule', [
              ZERO_CONTRACT_ADDRESS,
            ]) as `0x${string}`,
          },
          {
            to: ZERO_CONTRACT_ADDRESS,
            value: parseEther('0'),
            data: iface.encodeFunctionData('setHash', [hash]) as `0x${string}`,
          },
        ],
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
