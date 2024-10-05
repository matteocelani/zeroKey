import React from 'react';
// Importing Hooks
import { useAccount } from 'wagmi';
import { useSafes } from '@/hooks/requests/useSafes';
// Importing Components
import Meta from '@/components/Meta';
import Account from '@/components/Account';

export default function Dashboard() {
  const { data: safes, isLoading, error } = useSafes();
  const { address } = useAccount();

  // Questo è un placeholder. Dovresti implementare una funzione per ottenere il saldo effettivo.
  const getBalance = () => '0.0 ETH';

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Meta />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto flex justify-between items-center mb-8">
          <h1 className="text-xl font-medium bg-clip-text">Smart Account</h1>
          <button className="bg-success px-4 py-2 rounded-lg">
            Create Account
          </button>
        </div>
        <div className="space-y-4">
          {safes &&
            safes.map((safeAddress) => (
              <Account
                key={safeAddress}
                address={safeAddress}
                balance={getBalance()}
                ensName={undefined} // Aggiungi la logica per ottenere l'ENS name se necessario
              />
            ))}
          {/* Aggiungi l'account personale dell'utente */}
          {address && (
            <Account
              address={address}
              balance={getBalance()}
              ensName={undefined} // Aggiungi la logica per ottenere l'ENS name se necessario
            />
          )}
        </div>
      </div>
    </>
  );
}
