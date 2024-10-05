import React from 'react';

type RecoverInterfaceProps = {
  address: string;
  proofString: string;
};

export default function RecoverInterface({
  address,
  proofString,
}: RecoverInterfaceProps) {
  const handleRecover = () => {
    console.log('Performing recovery');
    console.log('For address:', address);
    console.log('Proof string:', proofString);
  };

  return (
    <div className="space-y-4">
      <p className="text-07 dark:text-03">
        Ready to recover account for address: {address}
      </p>
      <button
        onClick={handleRecover}
        className="w-full px-4 py-2 bg-info text-white rounded-lg"
      >
        Recover Account
      </button>
    </div>
  );
}
