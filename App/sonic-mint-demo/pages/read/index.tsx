import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePageContext } from '../../context';
import utils from '../../utils';
import idl from '../../idl/idl.json';
import migrateridl from '../../idl/migrateridl.json';
import { BorderAngular, NetworkRequire } from '../../components/Component';
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons';
import {
  Button,
  Link,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { publicKey } from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import {
  findMasterEditionPda,
  findMetadataPda,
  mplTokenMetadata,
  MPL_TOKEN_METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { TransactionInstruction, Transaction, PublicKey } from '@solana/web3.js';
const BufferLayout = require('@solana/buffer-layout');

export default function Read() {
  const toast = useToast();
  const anchorWallet = useAnchorWallet();

  const { isOpen: isOpenMintSuccess, onOpen: openMintSuccess, onClose: closeMintSuccess } = useDisclosure();
  const { isOpen: isOpenMintFailure, onOpen: openMintFailure, onClose: closeMintFailure } = useDisclosure();
  const { isOpen: isOpenSyncSuccess, onOpen: openSyncSuccess, onClose: closeSyncSuccess } = useDisclosure();
  const { Devnet, currentNet } = usePageContext();

  const steps = [1, 2, 3, 4, 5];
  const [stepIndex, setStepIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(false);
  const [mintNftTX, setMintNftTX] = useState('');
  const [mintNftAccount, setMintNftAccount] = useState('');
  const [syncRequestTX, setSyncRequestTX] = useState('');

  const [newAccount, setNewAccount] = useState<any>();
  const [mintProgramId, setMintProgramId] = useState(``); //HdBvhzMrhmdPyrbwL9ZR2ZFqhqVSKcDra7ggdWqCcwps
  const [metadata, setMetadata] = useState<any>();
  const syncProgramId = 'SonicAccountMigrater11111111111111111111111';

  // useEffect(() => {
  //   openSyncSuccess();
  //   console.log('currentNet', currentNet);
  // }, [currentNet]);

  function toConfirm() {
    if (!anchorWallet || !anchorWallet.publicKey) return toast({ title: 'Connect wallet', status: 'warning' });

    if (stepIndex > 2) {
      if (currentNet.value == Devnet.value) return toast({ title: `Please switch network`, status: 'warning' });
    } else {
      if (currentNet.value !== Devnet.value) return toast({ title: `Please switch network`, status: 'warning' });
    }

    if (stepIndex == 1) {
      generateAccount();
    } else if (stepIndex == 2) {
      getMetadata();
    } else if (stepIndex == 3) {
      againMintNft();
    } else if (stepIndex == 4) {
      syncRequest();
    } else if (stepIndex == 5) {
      mintNft(metadata);
    }
  }

  function modalToConfirm() {
    if (stepIndex == 1) {
    } else if (stepIndex == 2) {
      closeMintSuccess();
      setStepIndex(3);
    } else if (stepIndex == 3) {
      checkSyncStatus();
    } else if (stepIndex == 4) {
      closeSyncSuccess();
      setStepIndex(5);
    } else if (stepIndex == 5) {
      closeMintSuccess();
    }
  }

  function generateAccount() {
    if (!mintProgramId) return toast({ title: 'Fill in the Devnet program ID', status: 'warning' });
    const newAccount_ = anchor.web3.Keypair.generate();
    setNewAccount(newAccount_);
    setStepIndex(2);
  }

  async function getMetadata() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const num = utils.randomNum(1, 5);
      const uri = `https://bafybeieknoava43popez3aroo6umnv24gwy75jfvlcpsoz57ebvqpj5y54.ipfs.nftstorage.link/${num}.json`;
      const response = await axios.get(uri);
      const metadata_ = { ...response.data, uri };
      setMetadata(metadata_);
      setIsLoading(false);
      mintNft(metadata_);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({ title: 'Mint nft failed', status: 'error' });
    }
  }

  async function mintNft(metadata: any) {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let provider: any = anchor.getProvider();
      const program = new anchor.Program(idl as anchor.Idl, mintProgramId);
      const signer = provider.wallet;
      const umi = createUmi(currentNet.value).use(walletAdapterIdentity(signer)).use(mplTokenMetadata());
      const associatedTokenAccount = await getAssociatedTokenAddress(newAccount.publicKey, signer.publicKey);
      let metadataAccount = findMetadataPda(umi, {
        mint: publicKey(newAccount.publicKey)
      })[0];
      let masterEditionAccount = findMasterEditionPda(umi, {
        mint: publicKey(newAccount.publicKey)
      })[0];

      const initdata = {
        signer: provider.publicKey,
        mint: newAccount.publicKey,
        associatedTokenAccount,
        metadataAccount,
        masterEditionAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      };

      const tx = await program.methods
        .initNft(metadata.name, metadata.symbol, metadata.uri)
        .accounts(initdata)
        .signers([newAccount])
        .rpc();

      let account = '';
      let txhash = '';
      if (currentNet.value == Devnet.value) {
        txhash = `${currentNet.explorer}/tx/${tx}?cluster=devnet`;
        account = `${currentNet.explorer}/address/${newAccount.publicKey}?cluster=devnet`;
      } else {
        txhash = `${currentNet.explorer}/tx/${tx}?cluster=custom&customUrl=${currentNet.value}`;
        account = `${currentNet.explorer}/address/${newAccount.publicKey}?cluster=custom&customUrl=${currentNet.value}`;
      }
      console.log(`mint nft tx: `, txhash);
      setMintNftTX(txhash);

      console.log(`mint Account: `, account);
      setMintNftAccount(account);

      setIsLoading(false);
      openMintSuccess();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({ title: 'Mint nft failed', status: 'error' });
    }
  }

  function againMintNft() {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      openMintFailure();
    }, 1000);
  }

  function createInstructionData(index) {
    const dataLayout = BufferLayout.struct([BufferLayout.u32('instruction')]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({ instruction: index }, data);
    return data;
  }

  // 0 sync , 1 clear cache
  async function syncRequest() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // const syncProgram = new anchor.Program(migrateridl as anchor.Idl, syncProgramId);
      // const tx = await syncProgram.methods
      //   .migrateremoteaccounts()
      //   .accounts({
      //     programid: mintProgramId
      //   })
      //   .rpc();

      const transaction = new Transaction();
      const instruction1 = new TransactionInstruction({
        keys: [
          { pubkey: new PublicKey(mintProgramId), isSigner: false, isWritable: false },
          // { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          // { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID), isSigner: false, isWritable: false }
        ],
        programId: new PublicKey(syncProgramId),
        data: createInstructionData(0)
      });
      transaction.add(instruction1);

      let provider = anchor.getProvider();
      const tx = await provider.sendAndConfirm(transaction);
      const txhash = `${currentNet.explorer}/tx/${tx}?cluster=custom&customUrl=${currentNet.value}`;
      console.log(`sync request tx: `, txhash);
      setSyncRequestTX(txhash);

      setIsLoading(false);
      setSyncStatus(true);
      openSyncSuccess();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({ title: 'Sync request failed', status: 'error' });
    }
  }

  async function checkSyncStatus() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await utils.apiPost(currentNet.value, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [mintProgramId, { encoding: 'base58' }]
      });

      const res2 = await utils.apiPost(currentNet.value, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [MPL_TOKEN_METADATA_PROGRAM_ID, { encoding: 'base58' }]
      });

      const hasSync = res.result.value && res2.result.value;
      setSyncStatus(hasSync);
      setStepIndex(hasSync ? 5 : 4);
      setIsLoading(false);
      closeMintFailure();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  async function clearCache() {
    if (isLoading || !mintProgramId || currentNet.value == Devnet.value || !newAccount) return;
    setIsLoading(true);
    try {
      const transaction = new Transaction();
      const instruction1 = new TransactionInstruction({
        keys: [
          { pubkey: new PublicKey(mintProgramId), isSigner: false, isWritable: false },
          { pubkey: new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID), isSigner: false, isWritable: false }
        ],
        programId: new PublicKey(syncProgramId),
        data: createInstructionData(1)
      });
      transaction.add(instruction1);
      let provider = anchor.getProvider();
      const tx = await provider.sendAndConfirm(transaction);
      console.log('clear cache', tx);
      setSyncStatus(false);
      setIsLoading(false);
      toast({ title: 'clear cache success', status: 'success' });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="page_title">
        Ability to sync NFT programs from Solana Devnet to Hypergrid and verify sync status
      </div>
      <div className="stages">
        {steps.map((step) => (
          <div
            key={step}
            className={`animate__animated animate__zoomIn ${stepIndex >= step ? 'active' : ''}`}
            style={{ animationDelay: `${(step - 1) * 0.1}s` }}>
            Stage: {step}
            {stepIndex == step && <BorderAngular />}
          </div>
        ))}
      </div>

      {stepIndex == 3 && (
        <Button width="100%" bg="#2828b2" isLoading={isLoading} onClick={clearCache}>
          clear cache
        </Button>
      )}

      {stepIndex == 1 && (
        <div className="rowbox animate__animated animate__zoomIn">
          <BorderAngular />
          <div className="box">
            <div className="title">Fill in the program ID</div>
            <div className="text">Network: {Devnet.label}</div>
            <Input
              placeholder="Fill in the Devnet program ID"
              value={mintProgramId}
              onChange={(e) => setMintProgramId(e.target.value)}
            />
            <Button width="100%" bg="#2828b2" isLoading={isLoading} onClick={toConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      )}

      {stepIndex == 2 && (
        <div className="rowbox animate__animated animate__zoomIn">
          <BorderAngular />
          <div className="box">
            <div className="title">Interact with Devnet programs</div>
            <div className="text">Network: {Devnet.label}</div>
            <Button width="100%" bg="#2828b2" isLoading={isLoading} onClick={toConfirm}>
              Mint
            </Button>
          </div>
        </div>
      )}

      {stepIndex == 3 && (
        <div className="rowbox animate__animated animate__zoomIn">
          <BorderAngular />
          <div className="box">
            <div className="title">
              Try to interact with the same id program on <NetworkRequire />
            </div>
            <div className="text">
              Network: <NetworkRequire />
            </div>
            <div className="text">
              Sync status: <span className={syncStatus ? 'green' : 'red'}>{syncStatus ? 'Synced' : 'Not synced'}</span>
            </div>
            <Button width="100%" bg="#2828b2" isLoading={isLoading} onClick={toConfirm}>
              Mint
            </Button>
          </div>
        </div>
      )}

      {stepIndex == 4 && (
        <div className="rowbox animate__animated animate__zoomIn">
          <BorderAngular />
          <div className="box">
            <div className="title">Request sync program</div>
            <div className="text">
              Network: <NetworkRequire />
            </div>
            <div className="text">
              Sync status: <span className={syncStatus ? 'green' : 'red'}>{syncStatus ? 'Synced' : 'Not synced'}</span>
            </div>
            <div className="syncbox">
              {isLoading ? (
                <div className="videobox animate__animated animate__fadeIn">
                  <video src="/videos/sync.mp4" autoPlay muted loop></video>
                </div>
              ) : (
                <div className="imgbox animate__animated animate__fadeIn">
                  <div className="imgbox_">
                    <img className="chip" src="/images/chip.png" alt="" />
                    <p className="network">{Devnet.label}</p>
                  </div>
                  <div>
                    <img className="changeimg" src="/images/changeimg.png" alt="" />
                  </div>
                  <div className="imgbox_">
                    <img className={syncStatus ? 'chip' : 'chip disabled'} src="/images/chip.png" alt="" />
                    <p className="network">
                      <NetworkRequire />
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button width="100%" bg="#2828b2" isLoading={isLoading} onClick={toConfirm}>
              Sync request
            </Button>
          </div>
        </div>
      )}

      {stepIndex == 5 && (
        <div className="rowbox animate__animated animate__zoomIn">
          <BorderAngular />
          <div className="box">
            <div className="title">
              Try to interact with the same id program on <NetworkRequire /> Again
            </div>
            <div className="text">
              Network: <NetworkRequire />
            </div>
            <div className="text">
              Sync status: <span className={syncStatus ? 'green' : 'red'}>{syncStatus ? 'Synced' : 'Not synced'}</span>
            </div>
            <div className="syncbox">
              <div className="imgbox animate__animated animate__fadeIn">
                <div className="imgbox_">
                  <img className="chip" src="/images/chip.png" alt="" />
                  <p className="network">{Devnet.label}</p>
                </div>
                <div>
                  <img className="changeimg" src="/images/changeimg.png" alt="" />
                </div>
                <div className="imgbox_">
                  <img className={syncStatus ? 'chip' : 'chip disabled'} src="/images/chip.png" alt="" />
                  <p className="network">
                    <NetworkRequire />
                  </p>
                </div>
              </div>
            </div>

            <Button width="100%" bg="#2828b2" isLoading={isLoading} onClick={toConfirm}>
              Mint
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={isOpenMintSuccess} onClose={closeMintSuccess}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint successful</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {metadata && (
              <div className="nftbox">
                <div className="nft">
                  <img className="nftimg" src={metadata.image} alt="" />
                  {stepIndex == 5 ? (
                    <p className="network">
                      <NetworkRequire />
                    </p>
                  ) : (
                    <p className="network">{Devnet.label}</p>
                  )}
                </div>
                <p className="name">{metadata.name}</p>
                <p className="symbol">{metadata.symbol}</p>
                <p className="description">{metadata.description}</p>
                <div className="linkbox">
                  <Link href={mintNftTX} isExternal>
                    Mint NFT TX
                  </Link>
                  <Link href={mintNftAccount} isExternal>
                    Mint NFT Account
                  </Link>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button bg="#2828b2" onClick={modalToConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenMintFailure} onClose={closeMintFailure}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint failed</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>The program has not been synchronized yet, mint failed.</div>
          </ModalBody>
          <ModalFooter>
            <Button bg="#2828b2" isLoading={isLoading} onClick={modalToConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenSyncSuccess} onClose={closeSyncSuccess}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sync successful</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>Devnet network mint NFT program has been successfully synced to HyperGrid network</div>
            <div className="linkbox">
              <Link href={syncRequestTX} isExternal>
                Sync Request TX
              </Link>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button bg="#2828b2" onClick={modalToConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
