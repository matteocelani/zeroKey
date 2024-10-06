import React, { useState, useEffect } from 'react';
// Importing Hooks
import {
  useBalance,
  useEnsAddress,
  useEnsName,
  useAccount,
  useConnectorClient,
  useWriteContract,
} from 'wagmi';
// Importing Utils
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';
import { isValidAddress } from '@/lib/utils/addressUtils';
import { formatBalance } from '@/lib/utils/mathUtils';
import { zeroKeyModule } from '@/lib/constants/wagmiContractConfig';
// Importing Icons
import { CgSpinner } from 'react-icons/cg';
import { MdDone, MdClose } from 'react-icons/md';
// Safe Manager
import { SafeManager } from '@/lib/utils/safeManager';
import { useWalletClient } from 'wagmi';
import { Proof } from 'zokrates-js';

type SendInterfaceProps = {
  recoverAddress: string;
  proof: Proof;
};

export default function SendInterface({
  recoverAddress,
  proof,
}: SendInterfaceProps) {
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isValidRecipient, setIsValidRecipient] = useState(false);
  const [isCheckingENS, setIsCheckingENS] = useState(false);
  const { data: walletClient } = useWalletClient();
  const { data: connectorClient } = useConnectorClient();
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  useEffect(() => {
    async function initializeSafeManager() {
      if (walletClient) {
        const manager = new SafeManager();
        await manager.initializeWallet(address, walletClient);
      }
    }
    initializeSafeManager();
  }, [address, walletClient]);

  const { data: balance, isLoading: isLoadingBalance } = useBalance({
    address: recoverAddress as `0x${string}`,
    chainId: 8453, // Base network
  });

  const lowerCaseRecipient = recipientAddress.toLowerCase();

  const { data: ensAddress, isLoading: isLoadingEnsAddress } = useEnsAddress({
    name: lowerCaseRecipient.includes('.') ? lowerCaseRecipient : undefined,
    chainId: 1,
  });

  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address: isValidAddress(lowerCaseRecipient)
      ? (lowerCaseRecipient as `0x${string}`)
      : undefined,
    chainId: 1,
  });

  useEffect(() => {
    const isValidEthAddress = isValidAddress(lowerCaseRecipient);
    const isValidEns =
      lowerCaseRecipient.includes('.') && lowerCaseRecipient.length > 3;
    const isResolved = Boolean(ensAddress) || Boolean(ensName);

    setIsValidRecipient(isValidEthAddress || (isValidEns && isResolved));
    setIsCheckingENS(isLoadingEnsAddress || isLoadingEnsName);
  }, [
    lowerCaseRecipient,
    ensAddress,
    ensName,
    isLoadingEnsAddress,
    isLoadingEnsName,
  ]);

  const maxAmount = balance ? formatEther(balance.value) : '0';

  useEffect(() => {
    if (balance) {
      const currentAmount = parseFloat(amount);
      const maxAmount = parseFloat(formatEther(balance.value));
      if (currentAmount > maxAmount) {
        setAmount(formatEther(balance.value));
      }
    }
  }, [amount, balance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');
    if (
      value === '' ||
      (/^\d*\.?\d*$/.test(value) && !isNaN(parseFloat(value)))
    ) {
      setAmount(value);
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(e.target.value);
  };

  const handleMaxClick = () => {
    if (balance) {
      setAmount(formatEther(balance.value));
    }
  };

  const handleSend = async () => {
    if (!address || !connectorClient) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      const tx = {
        to: (ensAddress || recipientAddress) as `0x${string}`,
        value: parseEther(amount),
        callData: '0x',
      };

      if (!proof.proof || !proof.inputs) {
        throw new Error('Proof or inputs missing');
      }

      await writeContract({
        ...zeroKeyModule,
        functionName: 'executeTransactionWithProof',
        // @ts-expect-error - TS doesn't recognize number as a valid type for args
        args: [recoverAddress, tx, proof.proof, proof.inputs],
      });

      // The transaction has been submitted successfully if we reach this point
      toast.info('Transaction submitted', {
        duration: 5000,
      });
    } catch (error) {
      console.error(error);
      toast.error('Error submitting transaction: ' + (error as Error).message, {
        duration: 5000,
      });
    }
  };
  X;

  const isReadyToSend = Boolean(
    address &&
      isValidRecipient &&
      amount &&
      parseFloat(amount) > 0 &&
      parseFloat(amount) <= parseFloat(maxAmount)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-07 dark:text-03">Balance:</span>
        <span className="text-07 dark:text-03">
          {isLoadingBalance ? (
            <span className="animate-pulse">0.00 ETH</span>
          ) : (
            `${formatBalance(balance?.value ?? BigInt(0))} ETH`
          )}
        </span>
      </div>
      <div className="relative">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Amount (ETH)"
          className="w-full p-2 pr-16 bg-01 dark:bg-08 border border-04 dark:border-06 rounded-lg focus:outline-none"
        />
        <button
          onClick={handleMaxClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-05 text-white rounded text-sm"
        >
          Max
        </button>
      </div>
      <div className="relative">
        <input
          type="text"
          value={recipientAddress}
          onChange={handleRecipientChange}
          placeholder="Recipient Address or ENS"
          className={`w-full p-2 pr-10 bg-01 dark:bg-08 border ${
            isValidRecipient ? 'border-success' : 'border-04 dark:border-06'
          } rounded-lg focus:outline-none text-sm`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isCheckingENS && (
            <CgSpinner className="animate-spin h-5 w-5 text-06" />
          )}
          {!isCheckingENS && isValidRecipient && (
            <MdDone className="h-5 w-5 text-success" />
          )}
          {!isCheckingENS && !isValidRecipient && recipientAddress && (
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
      <button
        onClick={handleSend}
        disabled={!isReadyToSend}
        className="w-full px-4 py-2 bg-info text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}
