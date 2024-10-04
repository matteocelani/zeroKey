import React from 'react';
import Meta from '@/components/Meta';
import Account from '@/components/Account';

const Dashboard: React.FC = () => {
  // This would typically come from your state management or API
  const accounts = [
    { id: 1, address: '0x1234...5678', balance: '1.5 ETH' },
    { id: 2, address: 'johndoe.eth', balance: '0.5 ETH' },
  ];

  return (
    <>
      <Meta />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl xs:text-2xl s:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-warning to-danger text-transparent bg-clip-text">
            Accounts
          </h1>
          <button className="bg-03 text-07 px-4 py-2 rounded-lg hover:bg-04 transition-colors">
            Create Account
          </button>
        </div>
        <div className="space-y-4">
          {accounts.map((account) => (
            <Account key={account.id} {...account} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
