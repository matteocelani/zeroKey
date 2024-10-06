import React from 'react';
// Importing Icons
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6';
import { IoKey } from 'react-icons/io5';
import { FaEthereum } from 'react-icons/fa';

export default function AccountLoading() {
  return (
    <div className="max-w-2xl mx-auto bg-01 dark:bg-08 rounded-lg px-4 py-3 shadow-md animate-pulse mb-4">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
          <div className="w-14 h-14 flex-shrink-0 mr-4 bg-03 dark:bg-07 rounded-full"></div>
          <div className="flex-grow">
            <p className="font-semibold bg-03 dark:bg-07 h-4 w-24 rounded"></p>
            <p className="bg-03 dark:bg-07 h-4 w-16 mt-2 rounded"></p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-2 md:gap-4">
          <div className="grid grid-cols-2 md:flex md:flex-col gap-2 w-full md:w-auto">
            <button className="text-xs bg-03 dark:bg-07 text-transparent px-2 py-1 rounded flex items-center justify-center w-full md:w-28 whitespace-nowrap">
              <FaArrowUp className="mr-1 w-3 h-3" /> Send
            </button>
            <button className="text-xs bg-03 dark:bg-07 text-transparent px-2 py-1 rounded flex items-center justify-center w-full md:w-28 whitespace-nowrap">
              <FaArrowDown className="mr-1 w-3 h-3" /> Receive
            </button>
          </div>
          <div className="grid grid-cols-2 md:flex md:flex-col gap-2 w-full md:w-auto">
            <button className="text-xs bg-03 dark:bg-07 text-transparent px-2 py-1 rounded flex items-center justify-center w-full md:w-28 whitespace-nowrap">
              <FaEthereum className="mr-1 w-3 h-3" /> Setup ENS
            </button>
            <button className="text-xs bg-03 dark:bg-07 text-transparent px-2 py-1 rounded flex items-center justify-center w-full md:w-28 whitespace-nowrap">
              <IoKey className="mr-1 w-3 h-3" /> Setup ZeroKey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
