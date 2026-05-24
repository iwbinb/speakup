import { http, createConfig } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';

import { robinhoodTestnet, supportedChains } from './chains';
import { arbitrumSepolia } from 'viem/chains';

const WC_PROJECT_ID =
  process.env['NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID'] ?? '';

/**
 * Build the connectors array. injected() auto-discovers EIP-6963 wallets
 * (MetaMask, Rabby, Phantom, etc.). walletConnect() is only added when a
 * project id is configured, so the connector doesn't error at boot in
 * demo mode.
 */
const connectors = [
  injected({ shimDisconnect: true }),
  ...(WC_PROJECT_ID
    ? [
        walletConnect({
          projectId: WC_PROJECT_ID,
          showQrModal: true,
          metadata: {
            name: 'SpeakUp',
            description:
              'AI Copilot for on-chain shareholder governance.',
            url: 'https://speakup.vote',
            icons: ['https://speakup.vote/logo.svg'],
          },
        }),
      ]
    : []),
];

export const wagmiConfig = createConfig({
  chains: supportedChains,
  ssr: true,
  connectors,
  transports: {
    [robinhoodTestnet.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});
