import React, { useState, useEffect } from 'react';
//Importing Next
import Link from 'next/link';
//Importing Hooks
import { useAccount } from 'wagmi';
//Importing RainbowKit
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import ConnectButton from '@/components/ConnectButton';
//Importing Components
import ThemeSwitch from '@/components/ThemeSwitch';
// Import Types
import { NavigationProps } from '@/lib/types/layout';

export default function NavBar({ isOpen, toggleOpen }: NavigationProps) {
  const { isConnected } = useAccount();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="px-4 xs:px-6 md:px-8 bg-02 shadow-lg dark:bg-09">
      <nav className="min-h-24 flex items-center justify-between mx-auto">
        <Link href="/" target="_self" className="py-4 pr-4">
          Zero Key
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          {isConnected && <ConnectButton />}
          {isConnected && (
            <Link
              href="/zero"
              className="flex items-center justify-center text-sm sm:text-base px-3 sm:px-4 py-2 rounded-lg bg-primary text-white font-medium transition-colors hover:bg-primary/90"
            >
              Zero Transactions
            </Link>
          )}
          <ThemeSwitch />
        </div>

        <div className="flex items-center md:hidden">
          {isConnected && (
            <>
              <div className="mr-4">
                <ConnectButton />
              </div>
              <div
                onClick={toggleOpen}
                className={`hamburger flex flex-col justify-between w-6 h-5 cursor-pointer ${
                  isOpen ? 'open' : ''
                }`}
              >
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
