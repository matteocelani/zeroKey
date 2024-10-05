import React, { useState, useEffect, useMemo } from 'react';
// Importing Hooks
import { useEnsAddress, useReadContract } from 'wagmi';
// Import Icons
import { CgSpinner } from 'react-icons/cg';
// Import Utils
import { parseUnits, formatEther } from 'viem';
// Import Constants
import { ENS_BASE } from '@/lib/constants';
import { baseRegistrarController } from '@/lib/constants/wagmiContractConfig';

type SetupENSProps = {
  onSkip: () => void;
  onSetENS: (name: string, duration: number) => void;
};

export default function SetupENS({ onSkip, onSetENS }: SetupENSProps) {
  const [ensName, setEnsName] = useState('');
  const [isValidENS, setIsValidENS] = useState(false);
  const [isCheckingENS, setIsCheckingENS] = useState(false);
  const [years, setYears] = useState(1);

  const fullEnsName = ensName ? `${ensName}${ENS_BASE}` : '';

  const { data: ensAddress, isLoading } = useEnsAddress({
    name: fullEnsName.includes('.') ? fullEnsName : undefined,
    chainId: 1,
  });

  const secondsPerYear = 365 * 24 * 60 * 60;
  const durationInSeconds = years * secondsPerYear;

  const { data: registerPrice } = useReadContract({
    ...baseRegistrarController,
    functionName: 'registerPrice',
    args: ensName ? [ensName, BigInt(durationInSeconds)] : undefined,
  });

  useEffect(() => {
    setIsCheckingENS(isLoading);
    setIsValidENS(ensName.length > 0 && !ensAddress);
  }, [ensName, ensAddress, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidENS) {
      onSetENS(fullEnsName, years);
    }
  };

  const incrementYears = () => setYears((y) => Math.min(y + 1, 10));
  const decrementYears = () => setYears((y) => Math.max(y, 1));

  const formattedPrice = useMemo(() => {
    if (!registerPrice) return null;
    return formatEther(registerPrice);
  }, [registerPrice]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-07 dark:text-03">
        Setup ENS Name (Optional)
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={ensName}
            onChange={(e) => setEnsName(e.target.value.toLowerCase())}
            placeholder="Enter desired ENS name"
            className={`w-full p-3 pr-24 bg-01 dark:bg-08 border ${
              ensName
                ? isValidENS
                  ? 'border-success'
                  : 'border-danger'
                : 'border-04 dark:border-06'
            } rounded-lg shadow-sm text-07 dark:text-03 focus:outline-none`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isCheckingENS && (
              <CgSpinner className="animate-spin h-5 w-5 text-06" />
            )}
            <span className="bg-02 dark:bg-07 text-06 dark:text-04 px-2 py-1 rounded ml-2">
              {ENS_BASE}
            </span>
          </div>
        </div>
        {ensName && (
          <p
            className={`text-sm ${isValidENS ? 'text-success' : 'text-danger'}`}
          >
            {isValidENS
              ? `${fullEnsName} is available!`
              : `${fullEnsName} is already taken.`}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-07 dark:text-03">Registration period:</span>
          <div className="flex items-center">
            <button
              type="button"
              onClick={decrementYears}
              className="px-2 py-1 bg-03 dark:bg-07 text-07 dark:text-03 rounded-l"
            >
              -
            </button>
            <span className="px-4 py-1 bg-02 dark:bg-08 text-07 dark:text-03">
              {years} year{years !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={incrementYears}
              className="px-2 py-1 bg-03 dark:bg-07 text-07 dark:text-03 rounded-r"
            >
              +
            </button>
          </div>
        </div>
        {registerPrice && (
          <p className="text-sm text-07 dark:text-03">
            Registration price: {formatEther(registerPrice)} ETH
          </p>
        )}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 bg-03 dark:bg-07 text-07 dark:text-03 rounded-lg transition-colors"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={!isValidENS}
            className="px-4 py-2 bg-info text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            Set ENS Name
          </button>
        </div>
      </form>
    </div>
  );
}
