import React, { useState, useEffect } from 'react';
// Importing Hooks
import { useAccount, useBalance } from 'wagmi';
// Importing Utils
import { formatEther } from 'viem';

type SendInterfaceProps = {
  address: string;
  proofString: string;
};

export default function SendInterface({
  address,
  proofString,
}: SendInterfaceProps) {
  const [amount, setAmount] = useState('');
  const { address: userAddress } = useAccount();
  const { data: balance } = useBalance({
    address: userAddress,
  });

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

  const handleMaxClick = () => {
    if (balance) {
      setAmount(formatEther(balance.value));
    }
  };

  const handleSend = () => {
    console.log('Preparing to send transaction:');
    console.log('From:', userAddress);
    console.log('To:', address);
    console.log('Amount:', amount, 'ETH');
    console.log('Proof string:', proofString);
  };

  const isReadyToSend = Boolean(
    userAddress &&
      address &&
      amount &&
      parseFloat(amount) > 0 &&
      parseFloat(amount) <= parseFloat(maxAmount)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-07 dark:text-03">Balance:</span>
        <span className="text-07 dark:text-03">
          {balance ? `${formatEther(balance.value)} ETH` : 'Loading...'}
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
      <div className="text-sm text-07 dark:text-03">To: {address}</div>
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
