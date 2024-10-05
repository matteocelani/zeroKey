import React from 'react';
import { ConnectButton as RainbowButton } from '@rainbow-me/rainbowkit';
// Import Utils
import { getShortAddress } from '@/lib/utils/addressUtils';

interface ConnectButtonProps {
  className?: string;
}

export default function ConnectButton({ className }: ConnectButtonProps) {
  return (
    <RainbowButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        const buttonText = connected
          ? account.ensName || `${getShortAddress(account.address)}`
          : 'Connect Wallet';

        const handleClick = connected
          ? chain.unsupported
            ? openChainModal
            : openAccountModal
          : openConnectModal;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            className={className}
          >
            <button
              onClick={handleClick}
              type="button"
              className="flex items-center justify-center text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg bg-primary text-white font-medium transition-colors hover:bg-primary/90"
            >
              {buttonText}
            </button>
          </div>
        );
      }}
    </RainbowButton.Custom>
  );
}
