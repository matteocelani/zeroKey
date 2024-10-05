import React, { useState, useEffect } from 'react';
// Importing Hooks
import { useEnsAddress } from 'wagmi';
// Import Icons
import { CgSpinner } from 'react-icons/cg';
// Import Constants
import { ENS_BASE } from '@/lib/constants';

type SetupENSProps = {
  onSkip: () => void;
  onSetENS: (name: string) => void;
};

export default function SetupENS({ onSkip, onSetENS }: SetupENSProps) {
  const [ensName, setEnsName] = useState('');
  const [isValidENS, setIsValidENS] = useState(false);
  const [isCheckingENS, setIsCheckingENS] = useState(false);

  const fullEnsName = ensName ? `${ensName}${ENS_BASE}` : '';

  const { data: ensAddress, isLoading } = useEnsAddress({
    name: fullEnsName.includes('.') ? fullEnsName : undefined,
    chainId: 1, // Mainnet for ENS resolution
  });

  useEffect(() => {
    setIsCheckingENS(isLoading);
    setIsValidENS(ensName.length > 0 && !ensAddress);
  }, [ensName, ensAddress, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidENS) {
      onSetENS(fullEnsName);
    }
  };

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
