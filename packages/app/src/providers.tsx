'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider as PrivyWagmiProvider } from '@privy-io/wagmi';
import { WagmiProvider as PlainWagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { wagmiConfig } from './lib/wagmi';
import { robinhoodTestnet } from './lib/chains';
import { ChainProvider } from './lib/chain-context';
import { DemoAuthProvider, RealAuthProvider, isDemoMode } from './lib/auth';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  if (isDemoMode) {
    return (
      <QueryClientProvider client={queryClient}>
        <PlainWagmiProvider config={wagmiConfig}>
          <ChainProvider>
            <DemoAuthProvider>{children}</DemoAuthProvider>
          </ChainProvider>
        </PlainWagmiProvider>
      </QueryClientProvider>
    );
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#00c853',
          logo: '/logo.svg',
          showWalletLoginFirst: false,
        },
        loginMethods: ['email', 'google', 'apple', 'wallet'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: robinhoodTestnet,
        supportedChains: [...wagmiConfig.chains],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <PrivyWagmiProvider config={wagmiConfig}>
          <ChainProvider>
            <RealAuthProvider>{children}</RealAuthProvider>
          </ChainProvider>
        </PrivyWagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

