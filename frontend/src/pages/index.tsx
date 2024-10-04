import React, { Fragment } from 'react';
//Importing Hooks
import { useAccount } from 'wagmi';
// Importing Layout
import ContentLock from '@/layout/lock';
//Importing Components
import Meta from '@/components/Meta';
import Dashboard from '@/sections/Dashboard';

export default function Home() {
  const { isConnecting, isConnected, isDisconnected } = useAccount();

  if (isConnecting || !isConnected || isDisconnected) {
    return <ContentLock />;
  }

  return (
    <Fragment>
      <Meta />
      <div className="flex flex-col w-full h-full">
      <Dashboard />
      </div>
    </Fragment>
  );
}
