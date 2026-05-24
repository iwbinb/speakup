import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';

import { robinhoodTestnet, supportedChains } from './chains';
import { arbitrumSepolia } from 'viem/chains';

export const wagmiConfig = createConfig({
  chains: supportedChains,
  ssr: true,
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [robinhoodTestnet.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});
