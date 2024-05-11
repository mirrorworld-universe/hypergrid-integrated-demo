import { FC, ReactNode, useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
require('@solana/wallet-adapter-react-ui/styles.css');
import { usePageContext } from '../context';

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { endpoint } = usePageContext();

  const wallets = useMemo(() => {
    return [
      // new walletAdapterWallets.PhantomWalletAdapter(),
      // new walletAdapterWallets.SolflareWalletAdapter(),
      new walletAdapterWallets.BackpackWalletAdapter()
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
