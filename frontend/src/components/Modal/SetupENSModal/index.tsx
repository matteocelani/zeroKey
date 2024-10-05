// SetupENSModal.tsx
import React from 'react';
import SetupENS from '@/components/SetupENS';

type SetupENSModalProps = {
  address: string;
  onClose: () => void;
};

export default function SetupENSModal({address, onClose }: SetupENSModalProps) {
  const handleSetENS = (name: string) => {
    console.log('Setting up ENS name:', name);
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-09 bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-01 dark:bg-09 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-07 dark:text-02">
            Setup ENS
          </h2>
          <button
            onClick={onClose}
            className="text-06 hover:text-07 dark:text-04 dark:hover:text-02"
          >
            ✕
          </button>
        </div>

        <SetupENS address={address} onSkip={onClose} onSetENS={handleSetENS} />
      </div>
    </div>
  );
}
