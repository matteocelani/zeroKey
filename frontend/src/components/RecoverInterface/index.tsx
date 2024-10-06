import React from 'react';
// Importing Hooks
import {
  useAccount,
  useConnectorClient,
  useReadContract,
  useWriteContract,
  useTransaction,
} from 'wagmi';
// Importing Utils
import { ethers } from 'ethers';
import { parseEther } from 'viem';
import { SafeManager } from '@/lib/utils/safeManager';
import { useEthersSigner } from '@/hooks/useWagmi';
// Importing Constants
import { zeroKeyModule } from '@/lib/constants/wagmiContractConfig';
// Importing Types
import { Proof } from 'zokrates-js';

type RecoverInterfaceProps = {
  recoverAddress: string;
  proof: Proof;
};

export default function RecoverInterface({
  recoverAddress,
  proof,
}: RecoverInterfaceProps) {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isRegistering, isSuccess } = useTransaction({
    hash: hash as `0x${string}` | undefined,
  });

  const { data: connectorClient } = useConnectorClient();
  const { address } = useAccount();

  const handleRecover = async () => {
    if (!address || !connectorClient) {
      return;
    }

    try {
      // Initialize Safe manager
      const safeManager = new SafeManager();
      await safeManager.initializeWallet(recoverAddress, connectorClient);

      // Create transaction to swap owner
      const safeTransaction = await safeManager.createSwapOwnerTx(address);

      const tx = {
        to: recoverAddress as `0x${string}`,
        value: parseEther('0'),
        callData: safeTransaction.data.data as `0x${string}`,
      };

      if (!proof.proof || !proof.inputs) {
        throw new Error('Proof or inputs missing');
      }

      writeContract({
        ...zeroKeyModule,
        functionName: 'executeTransactionWithProof',
        // @ts-expect-error - TS doesn't recognize number as a valid type for args
        args: [recoverAddress, tx, proof.proof, proof.inputs],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-07 dark:text-03">Ready to recover: {recoverAddress}</p>
      <p className="text-07 dark:text-03">New Owner: {address}</p>
      <button
        onClick={handleRecover}
        className="w-full px-4 py-2 bg-info text-white rounded-lg"
      >
        Recover Account
      </button>
    </div>
  );
}
