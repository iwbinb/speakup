import { defineChain } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: 'Robinhood Chain Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.chain.robinhood.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.testnet.chain.robinhood.com',
      apiUrl: 'https://explorer.testnet.chain.robinhood.com/api',
    },
  },
  testnet: true,
});

export const supportedChains = [robinhoodTestnet, arbitrumSepolia] as const;
export type SupportedChainId = (typeof supportedChains)[number]['id'];

const envChainId = process.env['NEXT_PUBLIC_DEFAULT_CHAIN_ID'];
export const DEFAULT_CHAIN_ID: SupportedChainId = envChainId
  ? (Number(envChainId) as SupportedChainId)
  : robinhoodTestnet.id;
