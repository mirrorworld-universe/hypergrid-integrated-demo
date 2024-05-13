import { FC, useState, useEffect, useRef } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { usePageContext } from '../context';
import { useConnection, useWallet, useAnchorWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import utils from '../utils';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const AppBar = () => {
  const router = useRouter();
  const { Devnet, Testnet, Mainnet, HyperGrid, Custom, endpoint, setEndpoint, setWalletAccount } = usePageContext();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const networks = [Devnet, HyperGrid];
  const [showCustomBtn, setShowCustomBtn] = useState(false);

  useEffect(() => {
    const endpoint_ = localStorage.getItem('endpoint');
    if (endpoint_) setEndpoint(endpoint_);
  }, []);

  useEffect(() => {
    if (!wallet.connected) return;
    setWalletAccount(wallet.publicKey.toBase58());

    // connection.getAccountInfo(wallet.publicKey).then((info) => {
    //   if (info) {
    //     console.log('Balance', info.lamports / LAMPORTS_PER_SOL);
    //   }
    // });
  }, [wallet]);

  useEffect(() => {
    if (!endpoint) return;
    const isNetworks = networks.find((network) => network.value == endpoint);
    if (!isNetworks) setShowCustomBtn(true);

    if (!anchorWallet) return;
    const provider = new anchor.AnchorProvider(new Connection(endpoint), anchorWallet, {});
    anchor.setProvider(provider);
  }, [endpoint, anchorWallet]);

  const selectRpc = async (value) => {
    if (value) {
      setShowCustomBtn(false);
      setEndpoint(value);
      localStorage.setItem('endpoint', value);
    } else {
      setShowCustomBtn(true);
      setEndpoint(Custom.value);
      localStorage.setItem('endpoint', Custom.value);
    }
  };

  return (
    <div className="AppHeader">
      <div className="titlebox">
        <img className="logo" src="/images/logo2.png" alt="" />
        <Link href="/">
          <a className={router.pathname === '/' ? 'active' : ''}>Read Demo</a>
        </Link>
        <Link href="/write">
          <a className={router.pathname === '/write' ? 'active' : ''}>Write Demo</a>
        </Link>
      </div>

      <div className="selectnetwork">
        <Button ref={btnRef} bg="#2828b2" onClick={onOpen}>
          {networks.find((network) => network.value == endpoint)?.label || endpoint}
        </Button>
        <WalletMultiButton />

        <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Choose a Cluster</DrawerHeader>

            <DrawerBody>
              {networks.map((item, index) => (
                <div key={index}>
                  <Button
                    width="100%"
                    bg={endpoint == item.value ? '#2828b2' : ''}
                    variant="outline"
                    onClick={() => selectRpc(item.value)}>
                    {item.label}
                  </Button>
                  <br />
                  <br />
                </div>
              ))}
              <Button width="100%" variant="outline" bg={showCustomBtn ? '#2828b2' : ''} onClick={() => selectRpc('')}>
                {Custom.label}
              </Button>
              <br />
              <br />
              {showCustomBtn && (
                <div>
                  <Input
                    value={endpoint}
                    onChange={(e) => {
                      setEndpoint(e.target.value);
                      localStorage.setItem('endpoint', e.target.value);
                    }}
                  />
                </div>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
