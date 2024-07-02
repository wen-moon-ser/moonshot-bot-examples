import {
  Moonshot,
  Environment,
  SolanaSerializationService,
} from '@wen-moon-ser/moonshot-sdk';
import { Connection, Keypair } from '@solana/web3.js';
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

  const { transaction } = await token.prepareTx({
    slippageBps: 100,
    creatorPK: creator.publicKey.toBase58(),
    tokenAmount,
    collateralAmount,
    tradeDirection: 'BUY',
  });

  const versionedTransaction =
    SolanaSerializationService.deserializeVersionedTransaction(transaction);

  const signedTx = signVersionedTransaction(versionedTransaction!, creator);

  const connection = new Connection(rpcUrl);
  await connection.sendTransaction(signedTx, {
    skipPreflight: false,
    maxRetries: 0,
    preflightCommitment: 'confirmed',
  });
};

main().catch(console.error);
