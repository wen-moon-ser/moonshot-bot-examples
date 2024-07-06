import { Moonshot, Environment } from '@wen-moon-ser/moonshot-sdk';
import {
  ComputeBudgetProgram,
  Connection,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { signVersionedTransaction } from './utils';

const main = async (): Promise<void> => {
  const rpcUrl = 'https://api.mainnet-beta.solana.com';

  const moonshot = new Moonshot({
    rpcUrl,
    authToken: 'YOUR_AUTH_TOKEN',
    environment: Environment.MAINNET,
  });

  const token = moonshot.Token({
    mintAddress: 'HLzCwHi19PkUGmasU1naAYMuigsbTsHcj4egDdhd24s1',
  });

  const curvePos = await token.getCurvePosition();
  console.log(curvePos); // Prints the current curve position

  const creator = new Keypair();
  // make sure creator has funds

  const tokenAmount = 100000n * 1000000000n; // Buy 100k tokens

  const collateralAmount = await token.getCollateralAmountByTokens({
    tokenAmount,
    tradeDirection: 'BUY',
  });

  const { ixs } = await token.prepareIxs({
    slippageBps: 100,
    creatorPK: creator.publicKey.toBase58(),
    tokenAmount,
    collateralAmount,
    tradeDirection: 'BUY',
  });

  const priorityFee = 1000;
  ixs.unshift(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: priorityFee,
    }),
  );

  const connection = new Connection(rpcUrl);

  const latestBlockHash = await connection.getLatestBlockhash('confirmed');
  const messageV0 = new TransactionMessage({
    payerKey: creator.publicKey,
    recentBlockhash: latestBlockHash.blockhash,
    instructions: ixs,
  }).compileToV0Message();
  const transaction = new VersionedTransaction(messageV0);

  const signedTx = signVersionedTransaction(transaction, creator);

  await connection.sendTransaction(signedTx, {
    skipPreflight: false,
    maxRetries: 0,
    preflightCommitment: 'confirmed',
  });
};

main().catch(console.error);
