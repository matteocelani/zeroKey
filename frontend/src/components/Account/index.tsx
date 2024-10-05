import React, { useMemo } from 'react';
// Importin Next
import Image from 'next/image';
// Importing Hooks
import { useEnsName, useEnsAvatar, useBalance } from 'wagmi';
// Importing Icons
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6';
import { IoKey } from 'react-icons/io5';
import { FaEthereum } from 'react-icons/fa';
// Importing Utils
import { getShortAddress } from '@/lib/utils/addressUtils';
import { formatBalance } from '@/lib/utils/mathUtils';

type AccountProps = {
  address: string;
};

const emojis = [
  '🦊',
  '🐼',
  '🐵',
  '🦁',
  '🐯',
  '🐨',
  '🐰',
  '🐸',
  '🐷',
  '🐻',
  '🐙',
  '🦄',
  '🐬',
  '🦋',
  '🦜',
];

const colors = [
  '#FFB3BA',
  '#BAFFC9',
  '#BAE1FF',
  '#FFFFBA',
  '#FFDFBA',
  '#E0BBE4',
  '#957DAD',
  '#D291BC',
  '#FEC8D8',
  '#FFDFD3',
];

function generateAvatarData(address: string) {
  const hash = address
    .toLowerCase()
    .split('')
    .reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

  const emojiIndex = Math.abs(hash) % emojis.length;
  const colorIndex = Math.abs(hash) % colors.length;

  return {
    emoji: emojis[emojiIndex],
    backgroundColor: colors[colorIndex],
  };
}

export default function Account({ address }: AccountProps) {
  const avatarData = useMemo(() => generateAvatarData(address), [address]);

  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 8453, // Base network
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: 8453, // Base network
  });

  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
    chainId: 8453, // Base network
  });

  const displayName = ensName || getShortAddress(address);
  const balance = balanceData
    ? `${formatBalance(balanceData.value)} ${balanceData.symbol}`
    : '0.0 ETH';

  return (
    <div className="max-w-2xl mx-auto bg-01 dark:bg-08 rounded-lg px-4 py-3 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
          <div
            className="w-14 h-14 flex-shrink-0 mr-4 flex items-center justify-center rounded-full overflow-hidden"
            style={{ backgroundColor: avatarData.backgroundColor }}
          >
            {ensAvatar ? (
              <Image
                src={ensAvatar}
                alt="ENS Avatar"
                width={56}
                height={56}
                className="object-cover"
              />
            ) : (
              <span className="text-2xl">{avatarData.emoji}</span>
            )}
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-07 dark:text-02">{displayName}</p>
            <p className="text-06 dark:text-04">{balance}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-2 md:gap-4">
          <div className="grid grid-cols-2 md:flex md:flex-col gap-2 w-full md:w-auto">
            <button className="text-xs bg-02 text-07 px-2 py-1 rounded flex items-center justify-center hover:bg-03 transition-colors w-full md:w-28 whitespace-nowrap">
              <FaArrowUp className="mr-1 w-3 h-3" /> Send
            </button>
            <button className="text-xs bg-02 text-07 px-2 py-1 rounded flex items-center justify-center hover:bg-03 transition-colors w-full md:w-28 whitespace-nowrap">
              <FaArrowDown className="mr-1 w-3 h-3" /> Receive
            </button>
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-col gap-2 w-full md:w-auto">
            <button className="text-xs bg-02 text-07 px-2 py-1 rounded flex items-center justify-center hover:bg-03 transition-colors w-full md:w-28 whitespace-nowrap">
              <FaEthereum className="mr-1 w-3 h-3" /> Setup ENS
            </button>
            <button className="text-xs bg-02 text-07 px-2 py-1 rounded flex items-center justify-center hover:bg-03 transition-colors w-full md:w-28 whitespace-nowrap">
              <IoKey className="mr-1 w-3 h-3" /> Setup ZeroKey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
