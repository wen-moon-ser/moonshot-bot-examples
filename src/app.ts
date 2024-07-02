import { Moonshot, Environment } from '@wen-moon-ser/moonshot-sdk';

const main = async (): Promise<void> => {
  const rpcUrl = 'https://api.mainnet-beta.solana.com';

  const moonshot = new Moonshot({
    rpcUrl,
    authToken: 'YOUR_AUTH_TOKEN',
    environment: Environment.MAINNET,
  });

  const token = moonshot.Token({
    mintAddress: 'AhaAKM3dUKAeYoZCTXF8fqqbjcvugbgEmst6557jkZ9h',
  });

  const curvePos = await token.getCurvePosition();
  console.log(curvePos);
};

main().catch(console.error);
