import Safe, {
  PredictedSafeProps,
  CreateTransactionProps,
} from '@safe-global/protocol-kit';
import {
  SafeTransaction,
  TransactionResult as SafeCoreTransactionResult,
} from '@safe-global/safe-core-sdk-types';
import { TransactionResult as TypesKitTransactionResult } from '@safe-global/types-kit';
import { Client } from 'viem';
import { ethers } from 'ethers';
// Importing Constants
import { ZERO_CONTRACT_ADDRESS } from '@/lib/constants';

type CombinedTransactionResult = SafeCoreTransactionResult &
  TypesKitTransactionResult;

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
      // @ts-expect-error - Viem give me Never
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
      // @ts-expect-error - Viem give me Never
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
        // @ts-expect-error - Viem give me Never
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

  /* ------------------------------- Add Module ------------------------------- */

  async addSecret(
    smartAdress: string,
    hash: string
  ): Promise<CombinedTransactionResult> {
    if (!this.safeWallet) {
      throw new Error('Safe wallet not initialized');
    }

    const iface = new ethers.Interface([
      'function enableModule(address module) public',
      'function setHash(bytes32 hash) external',
    ]);

    const safeTransactionData: CreateTransactionProps = {
      transactions: [
        {
          to: smartAdress,
          value: '0',
          data: iface.encodeFunctionData('enableModule', [
            ZERO_CONTRACT_ADDRESS,
          ]) as `0x${string}`,
        },
        {
          to: ZERO_CONTRACT_ADDRESS,
          value: '0',
          data: iface.encodeFunctionData('setHash', [hash]) as `0x${string}`,
        },
      ],
    };

    const safeTransaction =
      await this.safeWallet.createTransaction(safeTransactionData);
    const signedSafeTransaction =
      await this.safeWallet.signTransaction(safeTransaction);
    const transactionsResult = await this.safeWallet.executeTransaction(
      signedSafeTransaction
    );
    return transactionsResult as CombinedTransactionResult;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Get Owner                                 */
  /* -------------------------------------------------------------------------- */

  async createSwapOwnerTx(newOwner: string): Promise<SafeTransaction> {
    if (!this.safeWallet) {
      throw new Error('Safe wallet not initialized');
    }

    const oldOwners = await this.safeWallet.getOwners();

    console.log('oldOwners', oldOwners);

    return this.safeWallet.createSwapOwnerTx({
      oldOwnerAddress: oldOwners[0],
      newOwnerAddress: newOwner,
    });
  }
}
