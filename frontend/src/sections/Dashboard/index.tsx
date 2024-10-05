import React, { useState } from 'react';
// Importing Hooks
import { useAccount } from 'wagmi';
import { useSafes } from '@/hooks/requests/useSafes';
// Importing Components
import Meta from '@/components/Meta';
import Account from '@/components/Account';
import AccountLoading from '@/components/Account/loading';
import CreateAccountModal from '@/components/Modal/CreateAccountModal';

export default function Dashboard() {
  const { data: safes, isLoading, error } = useSafes();
  const { address } = useAccount();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (error) return <div>Error: {error.message}</div>;

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <Meta />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto flex justify-between items-center mb-8">
          <h1 className="text-xl font-medium bg-clip-text">Smart Accounts</h1>
          <button
            className="bg-success px-4 py-2 rounded-lg text-white hover:bg-opacity-90 transition-colors"
            onClick={handleOpenCreateModal}
          >
            Create Account
          </button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            Array(4)
              .fill(null)
              .map((_, index) => <AccountLoading key={index} />)
          ) : (
            <>
              {safes &&
                safes.map((safeAddress) => (
                  <Account key={safeAddress} address={safeAddress} />
                ))}
              {address && <Account address={address} />}
            </>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateAccountModal onClose={handleCloseCreateModal} />
      )}
    </>
  );
}
