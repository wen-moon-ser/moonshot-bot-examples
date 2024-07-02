import { Keypair, VersionedTransaction } from '@solana/web3.js';

export const signVersionedTransaction = (
  transaction: VersionedTransaction,
  signatureWallet: Keypair,
): VersionedTransaction => {
  transaction.sign([signatureWallet]);
  return transaction;
};
