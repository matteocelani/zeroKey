import React, { useState, useEffect } from 'react';
// Importing Hooks
import { useBalance, useEnsAddress, useEnsName } from 'wagmi';
import { useTheme } from 'next-themes';
// Importing Utils
import { formatEther } from 'viem';
import QRCode from 'react-qr-code';
import { formatBalance } from '@/lib/utils/mathUtils';
import { isValidAddress } from '@/lib/utils/addressUtils';
// Importing Icons
import { CgSpinner } from 'react-icons/cg';
import { MdDone, MdClose } from 'react-icons/md';
// Safe Manager
import { SafeManager, initSafeManager } from '@/lib/utils/safeManager';
import { parseEther } from 'viem';
import { useWalletClient } from 'wagmi';
import { toast } from 'sonner';

type SendReceiveModalProps = {
  address: string;
  onClose: () => void;
  initialTab: 'send' | 'receive';
};

export default function SendReceiveModal({
  address,
  onClose,
  initialTab,
}: SendReceiveModalProps) {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<'send' | 'receive'>(initialTab);
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isValidRecipient, setIsValidRecipient] = useState(false);
  const [isCheckingENS, setIsCheckingENS] = useState(false);
  const [safeManager, setSafeManager] = useState<SafeManager | null>(null);
  const { data: walletClient } = useWalletClient();
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState<string | null>(
    null
  );
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function initializeSafeManager() {
      if (walletClient) {
        const manager = new SafeManager();
        await manager.initializeWallet(address, walletClient);
        setSafeManager(manager);
      }
    }
    initializeSafeManager();
  }, [address, walletClient]);

  const lowerCaseRecipient = recipientAddress.toLowerCase();

  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    chainId: 8453, // Base network
  });

  const { data: ensAddress, isLoading: isLoadingEnsAddress } = useEnsAddress({
    name: lowerCaseRecipient.includes('.') ? lowerCaseRecipient : undefined,
    chainId: 1, // Mainnet for ENS resolution
  });

  const { data: ensName, isLoading: isLoadingEnsName } = useEnsName({
    address: isValidAddress(lowerCaseRecipient)
      ? (lowerCaseRecipient as `0x${string}`)
      : undefined,
    chainId: 1, // Mainnet for ENS resolution
  });

  useEffect(() => {
    const isValidEthAddress = isValidAddress(recipientAddress);
    const isValidEns =
      recipientAddress.includes('.') && recipientAddress.length > 4;
    const isResolved = Boolean(ensAddress) || Boolean(ensName);

    setIsValidRecipient(isValidEthAddress || (isValidEns && isResolved));
    setIsCheckingENS(isLoadingEnsAddress || isLoadingEnsName);
  }, [
    recipientAddress,
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

  const handleTabChange = (tab: 'send' | 'receive') => {
    setActiveTab(tab);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(',', '.');
    if (
      value === '' ||
      (/^\d*\.?\d*$/.test(value) && !isNaN(parseFloat(value)))
    ) {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    if (balance) {
      setAmount(formatEther(balance.value));
    }
  };

  const handleSend = async () => {
    if (!safeManager || !isReadyToSend) return;

    setIsSending(true);

    // Show a pending toast
    const pendingToastId = toast.loading('Waiting for wallet confirmation...', {
      className: 'bg-blue-100 text-blue-800 border-l-4 border-blue-500 rounded-md',
    });

    // Set a timeout to dismiss the pending toast if the transaction is not sent
    const timeoutId = setTimeout(() => {
      toast.dismiss(pendingToastId);
      toast.error('Transaction was not confirmed in time. Please try again.', {
        className: 'bg-red-100 text-red-800 border-l-4 border-red-500 rounded-md',
      });
      setIsSending(false);
    }, 60000); // 1 minute timeout

    try {
      const recipientAddr = ensAddress || recipientAddress;
      const amountInWei = parseEther(amount);

      const transactionResult = await safeManager.createAndExecuteTransaction(
        recipientAddr,
        amountInWei.toString()
      );

      // Clear the timeout as the transaction was sent
      clearTimeout(timeoutId);

      console.log('Transaction sent. Hash:', transactionResult.hash);

      // Update the pending toast
      toast.loading('Transaction is being processed...', {
        id: pendingToastId,
        className: 'bg-blue-100 text-blue-800 border-l-4 border-blue-500 rounded-md',
      });

      // Wait for the transaction to be mined
      await safeManager.waitForTransaction(transactionResult.transactionResponse);

      console.log('Transaction mined. Hash:', transactionResult.hash);

      // Dismiss the pending toast and show a success toast
      toast.dismiss(pendingToastId);
      toast.success(
        `Successfully sent ${amount} ETH to ${recipientAddr}.
        Transaction hash: ${transactionResult.hash}`,
        {
          className: 'bg-green-100 text-green-800 border-l-4 border-green-500 rounded-md',
        }
      );
    } catch (error) {
      // Clear the timeout as an error occurred
      clearTimeout(timeoutId);

      console.error('Error sending transaction:', error);
      toast.dismiss(pendingToastId);
      toast.error('Failed to send transaction. Please try again.', {
        className: 'bg-red-100 text-red-800 border-l-4 border-red-500 rounded-md',
      });
    } finally {
      setIsSending(false);
      onClose(); // Close the modal after the transaction process
    }
  };

  const isReadyToSend = Boolean(
    address &&
      isValidRecipient &&
      amount &&
      parseFloat(amount) > 0 &&
      parseFloat(amount) <= parseFloat(maxAmount)
  );

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-01 dark:bg-09 rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-07 dark:text-02">
            {activeTab === 'send' ? 'Send' : 'Receive'}
          </h2>
          <button
            onClick={onClose}
            className="text-06 hover:text-07 dark:text-04 dark:hover:text-02"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-02 dark:bg-07 rounded-lg p-1 flex w-full">
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
              onClick={() => handleTabChange('receive')}
              className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'receive'
                  ? 'bg-info text-white shadow-lg'
                  : 'text-07 dark:text-03 hover:bg-03 dark:hover:bg-06'
              }`}
            >
              Receive
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-07 dark:text-03">Balance:</span>
            <span className="text-07 dark:text-03">
              {balance
                ? `${formatBalance(balance.value)} ${balance.symbol}`
                : 'Loading...'}
            </span>
          </div>

          {activeTab === 'send' ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Amount (ETH)"
                  className="w-full p-2 pr-16 bg-01 dark:bg-08 border border-04 dark:border-06 rounded-lg focus:outline-none text-sm"
                />
                <button
                  onClick={handleMaxClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-05 text-white rounded text-xs"
                >
                  Max
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Recipient Address or ENS"
                  className={`w-full p-2 pr-10 bg-01 dark:bg-08 border ${
                    isValidRecipient
                      ? 'border-success'
                      : 'border-04 dark:border-06'
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
                <div className="text-xs text-success mt-1">
                  Resolved: {ensAddress}
                </div>
              )}
              {ensName && (
                <div className="text-xs text-success mt-1">
                  Resolved: {ensName}
                </div>
              )}
              <button
                onClick={handleSend}
                disabled={!isReadyToSend || isSending}
                className="w-full px-4 py-2 bg-info text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-center">
                <QRCode
                  value={address}
                  size={200}
                  bgColor="transparent"
                  fgColor={theme === 'dark' ? '#ffffff' : '#000000'}
                />
              </div>
              <div className="text-xs text-07 dark:text-03 text-center">
                <p>Your receive address:</p>
                <p className="font-mono break-all mt-1">{address}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
