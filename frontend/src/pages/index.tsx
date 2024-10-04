import React, { Fragment } from 'react';
//Importing Hooks
import { useAccount } from 'wagmi';
// Importing Layout
import ContentLock from '@/layout/lock';
//Importing Components
import Meta from '@/components/Meta';

export default function Home() {
  const { isConnecting, isConnected, isDisconnected } = useAccount();

  if (isConnecting || !isConnected || isDisconnected) {
    return <ContentLock />;
  }

  return (
    <Fragment>
      <Meta />
      <div className="w-full flex flex-col"></div>
    </Fragment>
  );
}
