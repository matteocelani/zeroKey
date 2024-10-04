import React, { Fragment } from 'react';
//Importing Components
import Meta from '@/components/Meta';
import Dashboard from '@/sections/Dashboard';

export default function Home() {
  return (
    <Fragment>
      <Meta />
      <div className="flex flex-col w-full h-full">
      <Dashboard />
      </div>
    </Fragment>
  );
}
