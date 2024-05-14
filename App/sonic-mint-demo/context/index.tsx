import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import * as web3 from '@solana/web3.js';

type Network = {
  label: string;
  value: string;
  faucet?: string;
  explorer?: string;
};

type PageContextType = {
  Devnet: Network;
  Testnet: Network;
  Mainnet: Network;
  HyperGrid: Network;
  Custom: Network;
  currentNet: Network;
  setCurrentNet: Dispatch<SetStateAction<Network>>;
  solBalance: number;
  setSolBalance: Dispatch<SetStateAction<number>>;
};

const Context = createContext<PageContextType | undefined>(undefined);

type PageProviderProps = {
  children: ReactNode;
};

export function PageProvider({ children }: PageProviderProps) {
  const Testnet = { label: 'Solana-Testnet', value: web3.clusterApiUrl('testnet') };
  const Mainnet = { label: 'Solana-Mainnet', value: web3.clusterApiUrl('mainnet-beta') };
  const Devnet = {
    label: 'Solana-Devnet',
    value: web3.clusterApiUrl('devnet'),
    faucet: 'https://faucet.solana.com',
    explorer: 'https://explorer.solana.com'
  };
  const HyperGrid = {
    label: 'HyperGrid-Sonic',
    value: 'https://rpc.hypergrid.dev',
    faucet: 'https://faucet.hypergrid.dev',
    explorer: 'https://explorer.hypergrid.dev'
  };
  const Custom = { label: 'Custom RPC', value: 'https://rpc2.hypergrid.dev' };

  const [currentNet, setCurrentNet] = useState(Devnet);
  const [solBalance, setSolBalance] = useState(0);

  const contextValue: PageContextType = {
    Devnet,
    Testnet,
    Mainnet,
    HyperGrid,
    Custom,
    currentNet,
    setCurrentNet,
    solBalance,
    setSolBalance
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function usePageContext() {
  const context = useContext(Context);
  if (!context) {
    throw 'usePageContext must be used within a PageProvider';
  }
  return context;
}

// NFT铸造程序1：HdBvhzMrhmdPyrbwL9ZR2ZFqhqVSKcDra7ggdWqCcwps

// mint nft tx: https://explorer.solana.com/tx/4LSrqe1DCa9BJhMm5zFw6XqVL1xxXh8JtK4pNX79Q4x6K7SvRqhshVpZTUiSxunwaGpy8baEkiKxPj41YNPWLbTJ?cluster=devnet

// minted nft: https://explorer.solana.com/address/DnTa6yqMCLsFZuvA97XAsi5UbZPxmPzRxfBuMXf2v9ns?cluster=devnet

// NFT铸造程序2：D3gsRpnpzGfPPGxyme5d65D9YFTyUgd2ZLfgpEvsKdxd

// mint nft tx: https://explorer.solana.com/tx/5QWBfsXRZwvTj4SSafJJxMwCytHdw6pauDzQGmGeiRRbaVrws1Jehsha525sUBTfzhqEBbiw1krLmqcBD8WShY9i?cluster=devnet

// minted nft: https://explorer.solana.com/address/7ym3ygDync2wKChQNX5XcSoMMqJYMkX3BZ9GMwjweyaL?cluster=devnet

// NFT铸造程序3：7xBbGSSi11QzLkc6weru4pgE7F8yuR3LxpoR9nsgjB3a

// mint nft tx: https://explorer.solana.com/tx/2w2gGrHxcoHbxVJtkJNbh3rWZXyv4GHb5F1ZJPeDrX2LRRQDyqMmuDq6GdGrkiF271fvgTHiqr4qSjkMF9CGQS1Q?cluster=devnet

// minted nft: https://explorer.solana.com/address/AMMyGWhhR7QqNuZ7ZMVLaiM62iX6DEkGLUcjF4tvxNT6?cluster=devnet
