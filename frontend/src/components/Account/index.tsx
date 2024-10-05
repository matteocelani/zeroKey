import React from 'react';
import { FaWallet, FaPaperPlane, FaDownload, FaEthereum, FaKey } from 'react-icons/fa';

interface AccountProps {
  address: string;
  balance: string;
}

const Account: React.FC<AccountProps> = ({ address, balance }) => {
  const abbreviateAddress = (addr: string) => {
    if (addr.length <= 13) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="max-w-2xl mx-auto bg-02 dark:bg-08 rounded-lg p-4 md:p-6 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <FaWallet className="text-06 text-xl md:text-2xl mr-3" />
          <div>
            <p className="font-semibold text-07 dark:text-02 text-sm md:text-base">
              {abbreviateAddress(address)}
            </p>
            <p className="text-06 dark:text-04 text-xs md:text-sm">{balance}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <button className="text-xs md:text-sm bg-02 text-07 px-2 py-1 rounded flex items-center justify-center hover:bg-04 transition-colors w-full md:w-32">
              <FaPaperPlane className="mr-1 w-3 h-3" /> Send
            </button>
            <button className="text-xs md:text-sm bg-02 text-07 px-2 py-1 rounded flex items-center justify-center hover:bg-04 transition-colors w-full md:w-32">
              <FaDownload className="mr-1 w-3 h-3" /> Receive
            </button>
          </div>
          <div className="space-y-2">
            <button className="text-xs md:text-sm bg-02 text-07 px-2 py-1 rounded flex items-center justify-center hover:bg-04 transition-colors w-full md:w-32">
              <FaEthereum className="mr-1 w-3 h-3" /> Setup ENS
            </button>
            <button className="text-xs md:text-sm bg-02 text-07 px-2 py-1 rounded flex items-center justify-center hover:bg-04 transition-colors w-full md:w-32">
              <FaKey className="mr-1 w-3 h-3" /> Setup Zero Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
