import React, { Fragment } from 'react';
//Importing Components
import Meta from '@/components/Meta';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function Home() {
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
