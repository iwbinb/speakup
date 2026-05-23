import { http, createConfig } from 'wagmi';

import { robinhoodTestnet, supportedChains } from './chains';
import { arbitrumSepolia } from 'viem/chains';

export const wagmiConfig = createConfig({
  chains: supportedChains,
  ssr: true,
  transports: {
    [robinhoodTestnet.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});
