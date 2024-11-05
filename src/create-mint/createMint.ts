import {
  CurveType,
  Environment,
  MigrationDex,
  Moonshot,
  SolanaSerializationService,
  imagePathToBase64,
} from '@wen-moon-ser/moonshot-sdk';
import { Keypair } from '@solana/web3.js';
import testWallet from '../../test-wallet.json';

export const createMint = async (): Promise<void> => {
  console.log('--- Create mint example ---');

  const creator = Keypair.fromSecretKey(Uint8Array.from(testWallet));
  console.log('Creator: ', creator.publicKey.toBase58());

  const moonshot = new Moonshot({
    rpcUrl: 'https://api.devnet.solana.com',
    environment: Environment.DEVNET,
    chainOptions: {
      solana: { confirmOptions: { commitment: 'confirmed' } },
    },
  });

  const icon = imagePathToBase64('src/assets/icon.png');

  const prepMint = await moonshot.prepareMintTx({
    creator: creator.publicKey.toBase58(),
    name: 'SDK_MINT',
    symbol: 'SDK_MINT',
    curveType: CurveType.CONSTANT_PRODUCT_V1,
    migrationDex: MigrationDex.RAYDIUM,
    icon,
    description: 'Token minted using the @wen-moon-ser/moonshot-sdk',
    links: [{ url: 'https://x.com', label: 'x handle' }],
    banner: icon,
    tokenAmount: '42000000000',
  });

  const deserializedTransaction =
    SolanaSerializationService.deserializeVersionedTransaction(
      prepMint.transaction,
    );
  if (deserializedTransaction == null) {
    throw new Error('Failed to deserialize transaction');
  }

  deserializedTransaction.sign([creator]);

  const signedTransaction =
    SolanaSerializationService.serializeVersionedTransaction(
      deserializedTransaction,
    );

  const res = await moonshot.submitMintTx({
    tokenId: prepMint.tokenId,
    token: prepMint.token,
    signedTransaction,
  });

  console.log(res);
};
