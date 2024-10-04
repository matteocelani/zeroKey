import { useState, useEffect } from 'react';
//Importing Next
import Link from 'next/link';
//Importing Hooks
import { useAccount } from 'wagmi';
//Importing RainbowKit
import { ConnectButton } from '@rainbow-me/rainbowkit';
// Import Types
import { NavigationProps } from '@/lib/types/layout';

export default function NavBar({ isOpen, toggleOpen }: NavigationProps) {
  const { isConnecting, isConnected, isDisconnected } = useAccount();

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

        {isConnecting ||
          !isConnected ||
          (isDisconnected && (
            <div className="hidden md:flex items-center space-x-6">
              <ConnectButton />
            </div>
          ))}

        <div className="flex items-center md:hidden">
          {isConnecting ||
            !isConnected ||
            (isDisconnected && (
              <div className="hidden md:flex items-center space-x-6">
                <ConnectButton />
              </div>
            ))}
          <div
            onClick={toggleOpen}
            className={`hamburger flex flex-col justify-between w-6 h-5 cursor-pointer ml-4 ${
              isOpen ? 'open' : ''
            }`}
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
      </nav>
    </header>
  );
}
