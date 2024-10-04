import React, { Fragment, useEffect } from 'react';
//Importing Hooks
import { useAccount } from 'wagmi';
//Importing Components
import Meta from '@/components/Meta';

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <Fragment>
      <Meta />
      <div className="w-full flex flex-col"></div>
    </Fragment>
  );
}
