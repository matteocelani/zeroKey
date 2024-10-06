import Safe, {
  PredictedSafeProps,
  CreateTransactionProps,
} from '@safe-global/protocol-kit';
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';
// Importing Types & Interfaces
import { Client } from 'viem';
import { ethers } from 'ethers';

interface CombinedTransactionResult {
  hash: string;
  transactionResponse: ethers.TransactionResponse;
}

export async function initSafe(
  connectorClient: Client,
  saltNonce: string
): Promise<Safe> {
  if (!connectorClient || !connectorClient.account) {
    console.error('No connector client or account found');
    throw new Error('no connector client or account found');
  }

  try {
    const predictedSafe: PredictedSafeProps = {
      safeAccountConfig: {
        owners: [connectorClient.account.address],
        threshold: 1,
      },
      safeDeploymentConfig: {
        saltNonce,
        safeVersion: '1.4.1',
      },
    };

    const safe = await Safe.init({
      // @ts-expect-error - Viem type not return a Eip1193Provider
      provider: connectorClient,
      signer: connectorClient.account.address,
      predictedSafe,
    });
    return safe;
  } catch (error) {
    console.error('An error occurred during wallet initialization:', error);
    throw new Error(
      'fail to initialize wallet, please try again or contact support'
    );
  }
}

export async function initSafeManager(
  connectorClient: Client,
  safeAddress: string
): Promise<Safe> {
  if (!connectorClient || !connectorClient.account) {
    console.error('No connector client or account found');
    throw new Error('no connector client or account found');
  }

  try {
    let safe = await Safe.init({
      // @ts-expect-error - Viem type not return a Eip1193Provider
      provider: connectorClient,
      signer: connectorClient.account.address,
      safeAddress,
    });
    safe = await safe.connect({ safeAddress });
    return safe;
  } catch (error) {
    console.error('An error occurred during wallet initialization:', error);
    throw new Error(
      'fail to initialize wallet, please try again or contact support'
    );
  }
}

export class SafeManager {
  private safeWallet: Safe | null = null;

  async initializeWallet(
    wallet: string,
    connectorClient: Client
  ): Promise<boolean> {
    if (!connectorClient || !connectorClient.account) {
      console.error('No connector client or account found');
      return false;
    }

    try {
      this.safeWallet = await Safe.init({
        // @ts-expect-error - Viem type not return a Eip1193Provider
        provider: connectorClient,
        signer: connectorClient.account.address,
        safeAddress: wallet,
      });

      // Connessione al Safe specifico
      this.safeWallet = await this.safeWallet.connect({ safeAddress: wallet });

      return true;
    } catch (error) {
      console.error('An error occurred during wallet initialization:', error);
      return false;
    }
  }

  async isModuleEnabled(moduleAddress: string): Promise<boolean> {
    if (!this.safeWallet) {
      throw new Error('Safe wallet not initialized');
    }

    return this.safeWallet.isModuleEnabled(moduleAddress);
  }

  /* ----------------------------- Token Transfer ----------------------------- */

  async createNativeTokenTransfer(
    to: string,
    amount: string
  ): Promise<SafeTransaction> {
    if (!this.safeWallet) {
      throw new Error('Safe wallet not initialized');
    }

    const safeTransactionData: CreateTransactionProps = {
      transactions: [
        {
          to,
          value: amount,
          data: '0x',
        },
      ],
    };

    return this.safeWallet.createTransaction(safeTransactionData);
  }

  async createAndExecuteTransaction(
    to: string,
    amount: string
  ): Promise<CombinedTransactionResult> {
    if (!this.safeWallet) {
      throw new Error('Safe wallet not initialized');
    }

    // Create the transaction
    const safeTransaction = await this.createNativeTokenTransfer(to, amount);
    const signedSafeTransaction =
      await this.safeWallet.signTransaction(safeTransaction);
    const executeTxResponse = await this.safeWallet.executeTransaction(
      signedSafeTransaction
    );

    return executeTxResponse as CombinedTransactionResult;
  }

  async waitForTransaction(
    transactionResponse: ethers.TransactionResponse
  ): Promise<void> {
    await transactionResponse.wait();
  }
}
