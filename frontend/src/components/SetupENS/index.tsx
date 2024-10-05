import React, { useState } from 'react';

type SetupENSProps = {
  onSkip: () => void;
  onSetENS: (name: string) => void;
};

export default function SetupENS({ onSkip, onSetENS }: SetupENSProps) {
  const [ensName, setEnsName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetENS(ensName);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-07 dark:text-03">
        Setup ENS Name (Optional)
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={ensName}
          onChange={(e) => setEnsName(e.target.value)}
          placeholder="Enter desired ENS name"
          className="w-full p-3 bg-01 dark:bg-08 border border-04 dark:border-06 rounded-lg shadow-sm text-07 dark:text-03 focus:outline-none"
        />
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 bg-03 dark:bg-07 text-07 dark:text-03 rounded-lg transition-colors"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={!ensName}
            className="px-4 py-2 bg-info text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            Set ENS Name
          </button>
        </div>
      </form>
    </div>
  );
}
