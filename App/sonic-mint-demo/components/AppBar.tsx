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
  Button,
  Tooltip
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const AppBar = () => {
  const router = useRouter();
  const { Devnet, HyperGrid, Custom, currentNet, setCurrentNet, setWalletAccount, solBalance, setSolBalance } =
    usePageContext();
  const anchorWallet = useAnchorWallet();
  const wallet = useWallet();
  const { connection } = useConnection();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const networks = [Devnet, HyperGrid];
  const [showCustomBtn, setShowCustomBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentNet_ = localStorage.getItem('currentNet');
    if (currentNet_) setCurrentNet(JSON.parse(currentNet_));
  }, []);

  useEffect(() => {
    if (!wallet.connected) return;
    setWalletAccount(wallet.publicKey.toBase58());
    if (currentNet.faucet) {
      getBalance();
    }
  }, [wallet]);

  useEffect(() => {
    if (!currentNet.value) return;
    const isNetworks = networks.find((network) => network.value == currentNet.value);
    if (!isNetworks) setShowCustomBtn(true);
    if (!anchorWallet) return;
    const provider = new anchor.AnchorProvider(new Connection(currentNet.value), anchorWallet, {});
    anchor.setProvider(provider);
  }, [currentNet, anchorWallet]);

  async function getBalance() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const info = await connection.getAccountInfo(wallet.publicKey);
      console.log('info', info);
      setIsLoading(false);
      if (!info) return setSolBalance(0);
      const balance = info.lamports / LAMPORTS_PER_SOL;
      console.log('Balance', balance);
      setSolBalance(balance);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setSolBalance(0);
    }
  }

  function selectNet(value) {
    if (value) {
      setShowCustomBtn(false);
      setCurrentNet(value);
      localStorage.setItem('currentNet', JSON.stringify(value));
    } else {
      setShowCustomBtn(true);
      setCurrentNet(Custom);
      localStorage.setItem('currentNet', JSON.stringify(Custom));
    }
  }

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
        {currentNet.faucet && (
          <Button bg="#2828b2">
            <Link href={currentNet.faucet}>Faucet</Link>
          </Button>
        )}

        <Button ref={btnRef} bg="#2828b2" onClick={onOpen}>
          {currentNet.faucet ? currentNet.label : currentNet.value}
        </Button>

        <Tooltip placement="bottom" label="Click to refresh balance">
          <Button bg="#2828b2" isLoading={isLoading} onClick={getBalance}>
            SOL: {utils.formatNumber(solBalance, 2)}
          </Button>
        </Tooltip>

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
                    bg={item.value == currentNet.value ? '#2828b2' : ''}
                    variant="outline"
                    onClick={() => selectNet(item)}>
                    {item.label}
                  </Button>
                  <br />
                  <br />
                </div>
              ))}
              <Button
                width="100%"
                variant="outline"
                bg={showCustomBtn ? '#2828b2' : ''}
                onClick={() => selectNet(null)}>
                {Custom.label}
              </Button>
              <br />
              <br />
              {showCustomBtn && (
                <div>
                  <Input
                    value={Custom.value}
                    onChange={(e) => {
                      const net = { ...Custom, value: e.target.value };
                      setCurrentNet(net);
                      localStorage.setItem('currentNet', JSON.stringify(net));
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
