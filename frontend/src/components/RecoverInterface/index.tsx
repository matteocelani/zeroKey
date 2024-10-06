import React, { useEffect } from 'react';
import {
  useAccount,
  useConnectorClient,
  useWriteContract,
  useTransaction,
} from 'wagmi';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { SafeManager } from '@/lib/utils/safeManager';
import { getShortAddress } from '@/lib/utils/addressUtils';
import { zeroKeyModule } from '@/lib/constants/wagmiContractConfig';
import { Proof } from 'zokrates-js';

type RecoverInterfaceProps = {
  recoverAddress: string;
  proof?: Proof;
};

export default function RecoverInterface({
  recoverAddress,
  proof,
}: RecoverInterfaceProps) {
  const { writeContract, data: hash } = useWriteContract();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { isLoading: isRegistering, isSuccess } = useTransaction({
    hash: hash as `0x${string}` | undefined,
  });
  const { data: connectorClient } = useConnectorClient();
  const { address } = useAccount();

  useEffect(() => {
    if (isSuccess) {
      const toastId = toast.success('Transaction successful!');

      // Close the success toast after 3 seconds
      setTimeout(() => {
        toast.dismiss(toastId);
      }, 3000);
    }
  }, [isSuccess]);

  const handleRecover = async () => {
    if (!address || !connectorClient) {
      return;
    }

    try {
      const safeManager = new SafeManager();
      await safeManager.initializeWallet(recoverAddress, connectorClient);

      const safeTransaction = await safeManager.createSwapOwnerTx(address);

      const tx = {
        to: recoverAddress as `0x${string}`,
        value: parseEther('0'),
        callData: safeTransaction.data.data as `0x${string}`,
      };

      if (!proof) {
        throw new Error('Proof or inputs missing');
      }

      writeContract({
        ...zeroKeyModule,
        functionName: 'executeTransactionWithProof',
        // @ts-expect-error - TS doesn't recognize number as a valid type for args
        args: [recoverAddress, tx, proof.proof, proof.inputs],
      });

      toast.info('Transaction submitted');
    } catch (error) {
      console.error(error);
      toast.error('Error submitting transaction');
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-07 dark:text-03 hidden md:block">
        Recover address: {recoverAddress}
      </p>
      <p className="text-07 dark:text-03 md:hidden">
        Recover address: {getShortAddress(recoverAddress)}
      </p>
      <p className="text-07 dark:text-03 hidden md:block">
        New Owner: {address}
      </p>
      <p className="text-07 dark:text-03 md:hidden">
        New Owner: {getShortAddress(address || '')}
      </p>
      <button
        onClick={handleRecover}
        className="w-full px-4 py-2 bg-info text-white rounded-lg"
        disabled={isRegistering}
      >
        {isRegistering ? 'Recovering...' : 'Recover Account'}
      </button>
    </div>
  );
}
