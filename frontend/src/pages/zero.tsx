import React, { useState } from 'react';
import Meta from '@/components/Meta';

export default function Zero() {
  const [activeTab, setActiveTab] = useState('send');

  return (
    <>
      <Meta />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl xs:text-2xl s:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-warning to-danger text-transparent bg-clip-text">
          Secure Transactions & Recovery
        </h1>

        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex w-full max-w-xs">
            <button
              onClick={() => setActiveTab('send')}
              className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'send'
                  ? 'bg-info text-white shadow-lg'
                  : 'text-09 hover:bg-02'
              }`}
            >
              Send
            </button>
            <button
              onClick={() => setActiveTab('recovery')}
              className={`w-1/2 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === 'recovery'
                  ? 'bg-info text-white shadow-lg'
                  : 'text-09 hover:bg-02'
              }`}
            >
              Recovery
            </button>
          </div>
        </div>

        <div className="rounded-lg p-4 md:p-6 lg:p-8 transition-all duration-300">
          {activeTab === 'send' ? (
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Send Funds</h2>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Recover Smart Account
              </h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
