import React, { useState, useEffect, useMemo } from 'react';
// Importing Hooks
import {
  useEnsAddress,
  useReadContract,
  useWriteContract,
  useTransaction,
} from 'wagmi';
// Import Icons
import { CgSpinner } from 'react-icons/cg';
// Import Utils
import { ens_normalize } from '@adraffy/ens-normalize';
import { namehash, encodeFunctionData, getAddress } from 'viem';
import { formatBalance } from '@/lib/utils/mathUtils';
// Import Constants
import { ENS_BASE } from '@/lib/constants';
import {
  baseRegistrarController,
  baseL2Resolver,
} from '@/lib/constants/wagmiContractConfig';

type SetupENSModalProps = {
  address: string;
  onClose: () => void;
};

export default function SetupENSModal({
  address,
  onClose,
}: SetupENSModalProps) {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isRegistering, isSuccess } = useTransaction({
    hash: hash as `0x${string}` | undefined,
  });

  const [ensName, setEnsName] = useState('');
  const [isValidENS, setIsValidENS] = useState(false);
  const [isCheckingENS, setIsCheckingENS] = useState(false);
  const [years, setYears] = useState(1);
  const [error, setError] = useState<string | null>(null);

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
    // @ts-expect-error - TS doesn't recognize number as a valid type for args
    args: ensName.length >= 3 ? [ensName, durationInSeconds] : undefined,
  });

  useEffect(() => {
    setIsCheckingENS(ensName.length >= 3);
    if (ensName.length === 1 || ensName.length === 2) {
      setError('ENS name must be at least 3 characters long');
      setIsValidENS(false);
    } else if (ensName.length > 20) {
      setError('ENS name must not exceed 20 characters');
      setIsValidENS(false);
    } else if (ensName.length >= 3 && !isLoading) {
      if (ensAddress) {
        setError('This ENS name is already taken');
        setIsValidENS(false);
      } else {
        setError(null);
        setIsValidENS(true);
      }
      setIsCheckingENS(false);
    } else {
      setError(null);
      setIsValidENS(false);
    }
  }, [ensName, ensAddress, isLoading]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isSuccess, onClose]);

  const handleRegister = () => {
    if (isValidENS && registerPrice) {
      const durationInSeconds = BigInt(years * 365 * 24 * 60 * 60);
      const node = namehash(ens_normalize(`${ensName}${ENS_BASE}`));

      if (!address) {
        setError('No address provided');
        return;
      }

      const setBaseAddrData = encodeFunctionData({
        abi: baseL2Resolver.abi,
        functionName: 'setAddr',
        args: [node, BigInt(2147492101), getAddress(address)],
      });

      const setEthAddrData = encodeFunctionData({
        abi: baseL2Resolver.abi,
        functionName: 'setAddr',
        args: [node, BigInt(60), getAddress(address)],
      });

      const registerRequest = {
        name: ensName,
        owner: address as `0x${string}`,
        duration: durationInSeconds,
        resolver: baseL2Resolver.address,
        data: [setBaseAddrData, setEthAddrData],
        reverseRecord: true,
      };

      try {
        writeContract({
          ...baseRegistrarController,
          functionName: 'register',
          args: [registerRequest],
          value: registerPrice,
        });
      } catch (error) {
        console.error('Error registering ENS:', error);
        setError('Failed to register ENS. Please try again.');
      }
    }
  };

  const formattedPrice = useMemo(() => {
    if (!registerPrice) return null;
    return formatBalance(registerPrice);
  }, [registerPrice]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-09 bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-01 dark:bg-09 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-07 dark:text-02">
            Setup ENS
          </h2>
          <button
            onClick={onClose}
            className="text-06 hover:text-07 dark:text-04 dark:hover:text-02"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
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
            {error && <p className="text-sm text-danger">{error}</p>}
            {isCheckingENS && (
              <p className="text-sm text-warning">Checking availability...</p>
            )}
            {isValidENS && !isCheckingENS && (
              <p className="text-sm text-success">
                {fullEnsName} is available!
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-07 dark:text-03">Registration period:</span>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setYears((y) => (y > 1 ? y - 1 : 1))}
                  className="px-2 py-1 bg-03 dark:bg-07 text-07 dark:text-03 rounded-l"
                >
                  -
                </button>
                <span className="px-4 py-1 bg-02 dark:bg-08 text-07 dark:text-03">
                  {years} year{years !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setYears((y) => y + 1)}
                  className="px-2 py-1 bg-03 dark:bg-07 text-07 dark:text-03 rounded-r"
                >
                  +
                </button>
              </div>
            </div>
            {formattedPrice && (
              <p className="text-sm text-07 dark:text-03">
                Registration price: {formattedPrice} ETH
              </p>
            )}
            {!isSuccess ? (
              <button
                onClick={handleRegister}
                disabled={!isValidENS || isCheckingENS || isRegistering}
                className="w-full px-4 py-2 bg-info text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                {isRegistering ? 'Registering...' : 'Set ENS Name'}
              </button>
            ) : (
              <button
                disabled
                className="w-full px-4 py-2 bg-success text-white rounded-lg cursor-not-allowed"
              >
                ENS registration successful! This window will close shortly.
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
