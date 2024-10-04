import React, { Fragment, useEffect } from 'react';
//Importing Hooks
import { useAccount } from 'wagmi';
//Importing Components
import Meta from '@/components/Meta';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function Home() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      console.log('Wallet address: ', address);
    } else {
      console.log('Not connected');
    }
  }, [address, isConnected]);

  return (
    <Fragment>
      <Meta />

      <div className="w-full flex flex-col">
        <div className="flex justify-center mt-8">
          <ThemeSwitch />
        </div>
      </div>
    </Fragment>
  );
}
