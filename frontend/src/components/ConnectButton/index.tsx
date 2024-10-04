import React from 'react';
// Connect Button
import { ConnectButton as RaimbowButton } from '@rainbow-me/rainbowkit';

export default function ConnectButton({ className }: { className?: string }) {
  return (
    <RaimbowButton.Custom>
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
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="w-40 flex items-center justify-center text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg bg-primary"
                  >
                    Connect Wallet
                  </button>
                );
              }

              return (
                <button
                  onClick={
                    chain.unsupported ? openChainModal : openAccountModal
                  }
                  type="button"
                  className="w-40 flex items-center justify-center text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg bg-primary"
                >
                  {account.displayName}
                </button>
              );
            })()}
          </div>
        );
      }}
    </RaimbowButton.Custom>
  );
}
