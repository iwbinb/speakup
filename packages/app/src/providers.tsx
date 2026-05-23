'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { wagmiConfig } from './lib/wagmi';
import { robinhoodTestnet } from './lib/chains';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  if (!PRIVY_APP_ID) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="card max-w-lg">
          <h2 className="text-xl font-semibold mb-2">SpeakUp setup needed</h2>
          <p className="text-ink-700 text-sm">
            Set <code className="bg-ink-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_PRIVY_APP_ID</code>{' '}
            in <code>.env</code> to enable wallet login. See
            <a className="underline ml-1" href="https://dashboard.privy.io">
              dashboard.privy.io
            </a>
            .
          </p>
        </div>
      </div>
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
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
