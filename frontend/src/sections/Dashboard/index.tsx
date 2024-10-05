import React, { useMemo } from 'react';
import Meta from '@/components/Meta';
import Account from '@/components/Account';
import { useAccounts } from '@/hooks/useAccounts';
import { useAccount } from 'wagmi';

const Dashboard: React.FC = () => {
  const { address } = useAccount();

  const { useGetAccounts } = useAccounts(address || '');
  const { data: accountsData, isLoading, error } = useGetAccounts();

  const accounts = useMemo(() => {
    if (!accountsData) return [];
    return Object.entries(accountsData).flatMap(([chainId, addresses]) =>
      addresses.map((address) => ({
        id: `${chainId}-${address}`,
        address,
        balance: 'Loading...', // You'd need to fetch balances separately
      }))
    );
  }, [accountsData]);

  if (!address) {
    return <div>Please connect your wallet to view accounts.</div>;
  }

  return (
    <>
      <Meta />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl xs:text-2xl s:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-warning to-danger text-transparent bg-clip-text leading-normal py-2">
              Zero Key Accounts
            </h1>
            <button className="bg-03 text-07 px-4 py-2 rounded-lg hover:bg-04 transition-colors">
              Create Account
            </button>
          </div>
          {isLoading && <div>Loading accounts...</div>}
          {error && <div>Error loading accounts: {error.message}</div>}
          {accounts.length > 0 && (
            <div className="space-y-4">
              {accounts.map((account) => (
                <Account key={account.id} {...account} />
              ))}
            </div>
          )}
          {!isLoading && !error && accounts.length === 0 && (
            <div>No accounts found for this address.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
