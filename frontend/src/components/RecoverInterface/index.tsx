import React from 'react';
// Importing Hooks
import { useAccount, useConnectorClient } from 'wagmi';
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
  const ethersSigner = useEthersSigner();

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

      console.log('tx', tx);

      const contract = new ethers.Contract(
        zeroKeyModule.address,
        zeroKeyModule.abi,
        ethersSigner
      );

      if (!proof.proof || !proof.inputs) {
        throw new Error('Proof or inputs missing');
      }

      console.log('address', address);
      console.log('tx', tx);
      console.log('proof', JSON.stringify(proof.proof));
      console.log('inputs', JSON.stringify(proof.inputs));

      // Call the contract function
      const transaction = await contract.executeTransactionWithProof(
        address,
        tx,
        proof.proof,
        proof.inputs
      );

      console.log('Transaction sent:', transaction.hash);

      // Wait for the transaction to be mined
      const receipt = await transaction.wait();
      console.log('Transaction confirmed:', receipt);
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
