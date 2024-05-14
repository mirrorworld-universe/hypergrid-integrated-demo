import { useState, useEffect } from 'react';
import { usePageContext } from '../../context';
import utils from '../../utils';
import axios from 'axios';
import hgnft from '../../idl/hgnft.json';
import { BorderAngular, NetworkRequire } from '../../components/Component';
import { PhoneIcon, AddIcon, LockIcon } from '@chakra-ui/icons';
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
import { BN } from '@project-serum/anchor';
import {
  findMasterEditionPda,
  findMetadataPda,
  mplTokenMetadata,
  MPL_TOKEN_METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';

import { TransactionInstruction, Transaction, PublicKey } from '@solana/web3.js';
const BufferLayout = require('@solana/buffer-layout');

export default function Write() {
  const toast = useToast();
  const anchorWallet = useAnchorWallet();

  const { isOpen: isOpenUpgradeSuccess, onOpen: openUpgradeSuccess, onClose: closeUpgradeSuccess } = useDisclosure();
  const { isOpen: isOpenMintSuccess, onOpen: openMintSuccess, onClose: closeMintSuccess } = useDisclosure();
  const { Devnet, currentNet } = usePageContext();

  const steps = [1, 2, 3, 4, 5];
  const steps2 = [1, 2, 3, 4];
  const [stepIndex, setStepIndex] = useState(1);
  const [stepIndex2, setStepIndex2] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState(false);
  const [unlockStatus, setUnlockStatus] = useState(false);
  const [lockStatus, setLockStatus] = useState(false);
  const [upgradeStatus, setUpgradeStatus] = useState(false);
  const [upgrade2Status, setUpgrade2Status] = useState(false);
  const [mintNftTX, setMintNftTX] = useState('');
  const [L1LockTX, setL1LockTX] = useState('');
  const [L1SetValue, setL1SetValueTX] = useState('');
  const [L2SetValueTX, setL2SetValueTX] = useState('');

  const [newAccount, setNewAccount] = useState<any>();
  const [mintProgramId, setMintProgramId] = useState(`4WTUyXNcf6QCEj76b3aRDLPewkPGkXFZkkyf3A3vua1z`);
  const [mintProgram, setMintProgram] = useState<anchor.Program>();
  const [metadata, setMetadata] = useState<any>({
    name: 'Sonic NFT',
    symbol: 'SNFT',
    description: 'Sonic Warrior - Type II',
    image: 'https://bafybeigrhybzerxl2ey63bfhy4dz6r47m52mvs37w7jimsnccdmieilrxa.ipfs.nftstorage.link/2.jpg',
    level: 1
  });
  const syncProgramId = 'SonicAccountMigrater11111111111111111111111';

  // useEffect(() => {
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
      upgradeRequest();
    } else if (stepIndex == 4) {
      setStepIndex(5);
    } else if (stepIndex == 5) {
    }
  }

  function modalToConfirm() {
    if (stepIndex == 1) {
    } else if (stepIndex == 2) {
      closeMintSuccess();
      setStepIndex(3);
    } else if (stepIndex == 3) {
      closeUpgradeSuccess();
      setStepIndex(4);
      nextStep();
    } else if (stepIndex == 4) {
      setStepIndex(5);
    } else if (stepIndex == 5) {
    }
  }

  function nextStep() {
    setSyncStatus(false);
    setIsLoading(false);
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSyncStatus(true);

        setTimeout(() => {
          setStepIndex2(2);
          nextStep2();
        }, 2000);
      }, 2000);
    }, 2000);
  }
  function nextStep2() {
    setLockStatus(false);
    setTimeout(() => {
      setLockStatus(true);

      setTimeout(() => {
        setStepIndex2(3);
        nextStep3();
      }, 2000);
    }, 2000);
  }
  function nextStep3() {
    setUnlockStatus(false);
    setUpgradeStatus(false);
    setTimeout(() => {
      setUnlockStatus(true);
      setTimeout(() => {
        setUpgradeStatus(true);

        setTimeout(() => {
          setStepIndex2(4);
          nextStep4();
        }, 2000);
      }, 2000);
    }, 2000);
  }
  function nextStep4() {
    setUpgrade2Status(false);
    setTimeout(() => {
      setUpgrade2Status(true);
    }, 2000);
  }

  function generateAccount() {
    if (!mintProgramId) return toast({ title: 'Fill in the Devnet program ID', status: 'warning' });

    const program = new anchor.Program(hgnft as anchor.Idl, mintProgramId);
    setMintProgram(program);

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
      const metadata_ = { ...response.data, uri, level: 1 };
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
    console.log('metadata', metadata);
    setIsLoading(true);
    try {
      const tx = await mintProgram.methods
        .mintnft(metadata.name, metadata.uri, new BN(metadata.level))
        .accounts({ mint: newAccount.publicKey })
        .signers([newAccount])
        .rpc();

      const txhash = `${currentNet.explorer}/tx/${tx}?cluster=devnet`;
      console.log(`mint nft tx: `, txhash);
      setMintNftTX(txhash);

      setIsLoading(false);
      openMintSuccess();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({ title: 'Mint nft failed', status: 'error' });
    }
  }

  async function upgradeRequest() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // const newLevel = new BN(metadata.level);
      // const tx = await mintProgram.methods
      //   .setvalue(newLevel)
      //   .accounts({
      //     mint: newAccount.publicKey
      //   })
      //   .rpc();

      // const txhash = `${currentNet.explorer}/tx/${tx}?cluster=devnet`;
      // console.log(`set value tx: `, txhash);
      // setL2SetValueTX(txhash);

      const transaction = new Transaction();
      const instruction1 = new TransactionInstruction({
        keys: [
          { pubkey: new PublicKey(mintProgramId), isSigner: false, isWritable: false },
          { pubkey: new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID), isSigner: false, isWritable: false }
        ],
        programId: new PublicKey(syncProgramId),
        data: createInstructionData(0)
      });
      transaction.add(instruction1);

      let provider = anchor.getProvider();
      const tx = await provider.sendAndConfirm(transaction);
      const txhash = `${currentNet.explorer}/tx/${tx}?cluster=devnet`;
      console.log(`sync request tx: `, txhash);

      setIsLoading(false);
      openUpgradeSuccess();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({ title: 'Upgrade failed', status: 'error' });
    }
  }

  function createInstructionData(index) {
    const dataLayout = BufferLayout.struct([BufferLayout.u32('instruction')]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({ instruction: index }, data);
    return data;
  }

  return (
    <>
      <div className="page_title">Sync and modify the Solana Devnet NFT program on Hypergrid</div>
      <div className="stages">
        {steps.map((step) => (
          <div
            key={step}
            className={`animate__animated animate__zoomIn ${stepIndex >= step ? 'active' : ''}`}
            style={{ animationDelay: `${(step - 1) * 0.1}s` }}
            onClick={() => setStepIndex(step)}>
            Stage: {step}
            {stepIndex == step && <BorderAngular />}
          </div>
        ))}
      </div>

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
              Try to set value on <NetworkRequire />
            </div>
            <div className="text">
              Network: <NetworkRequire />
            </div>
            {metadata && (
              <div className="nftboxlist">
                <div className="nftbox">
                  <div className="nft">
                    <img className="nftimg" src={metadata.image} alt="" />
                    <p className="network">{Devnet.label}</p>
                  </div>
                  <p className="level">level: {metadata.level}</p>
                </div>
                <img className="changeimg" src="/images/changeimg.png" alt="" />
                <div className="nftbox">
                  <div className="nft active">
                    <img className="nftimg" src={metadata.image} alt="" />
                    <p className="network">{Devnet.label}</p>
                  </div>
                  <p className="level active">level: {metadata.level + 1}</p>
                </div>
              </div>
            )}
            <div className="text">Confirm whether to upgrade NFT on HyperGrid network?</div>
            <Button width="100%" bg="#2828b2" isLoading={isLoading} onClick={toConfirm}>
              Upgrade on HyperGrid
            </Button>
          </div>
        </div>
      )}

      {stepIndex == 4 && (
        <div className="rowbox animate__animated animate__zoomIn">
          <BorderAngular />
          <div className="box">
            <div className="title">Set value progress</div>
            <div className="text">
              Network: <NetworkRequire />
            </div>
            <div className="stages2">
              {steps2.map((step) => (
                <div key={step}>
                  <div
                    className={`animate__animated animate__zoomIn ${stepIndex2 >= step ? 'active' : ''}`}
                    style={{ animationDelay: `${(step - 1) * 0.1}s` }}
                    onClick={() => {
                      setStepIndex2(step);
                      if (step == 1) {
                        nextStep();
                      } else if (step == 2) {
                        nextStep2();
                      } else if (step == 3) {
                        nextStep3();
                      } else if (step == 4) {
                        nextStep4();
                      } else if (step == 5) {
                      }
                    }}>
                    {step}
                  </div>
                  {step < steps2.length && (
                    <div className={`animate__animated animate__zoomIn ${stepIndex2 >= step ? 'active' : ''}`}>➡</div>
                  )}
                </div>
              ))}
            </div>

            {stepIndex2 == 1 && (
              <div className="animate__animated animate__fadeIn">
                <div className="text">perform synchronization procedure</div>
                <div className="text">
                  Sync status:{' '}
                  <span className={syncStatus ? 'green' : 'red'}>{syncStatus ? 'Synced' : 'Not synced'}</span>
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
              </div>
            )}

            {stepIndex2 == 2 && metadata && (
              <div className="animate__animated animate__fadeIn">
                <div className="text">NFT levels on Devnet network locked</div>
                <div className="nftbox">
                  <div className={lockStatus ? 'nft animate__animated animate__flipInY disabled' : 'nft'}>
                    <img className="nftimg" src={metadata.image} alt="" />
                    <p className="network">{Devnet.label}</p>
                  </div>
                  <p className="name">{metadata.name}</p>
                  <p className="level">
                    <span>level: {metadata.level}</span>
                    {lockStatus && <LockIcon className="lock animate__animated animate__zoomInDown" />}
                  </p>
                  {lockStatus && (
                    <div className="linkbox animate__animated animate__fadeIn">
                      <Link href={L1LockTX} isExternal>
                        L1 Lock tx
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {stepIndex2 == 3 && metadata && (
              <div className="animate__animated animate__fadeIn">
                <div className="text">
                  NFT levels on the Devnet network are locked and ready to be upgraded to level2
                </div>
                {upgradeStatus ? (
                  <>
                    <div className="nftbox animate__animated animate__flipInY">
                      <div className="nft active">
                        <img className="nftimg" src={metadata.image} alt="" />
                        <p className="network">{Devnet.label}</p>
                      </div>
                      <p className="name">{metadata.name}</p>
                      <p className="level active">level: {metadata.level + 1}</p>
                    </div>
                    <div className="linkbox animate__animated animate__fadeIn">
                      <Link href={L1SetValue} isExternal>
                        L1 Set Value tx
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="nftbox animate__animated animate__fadeIn">
                    <div className={unlockStatus ? 'nft animate__animated animate__tada' : 'nft disabled'}>
                      <img className="nftimg" src={metadata.image} alt="" />
                      <p className="network">{Devnet.label}</p>
                    </div>
                    <p className="name">{metadata.name}</p>
                    <p className="level">
                      <span>level: {metadata.level}</span>
                      {!unlockStatus && <LockIcon className="lock" />}
                    </p>
                  </div>
                )}
              </div>
            )}

            {stepIndex2 == 4 && metadata && (
              <div className="animate__animated animate__fadeIn">
                <div className="text">NFT level has been upgraded successfully</div>
                {upgrade2Status ? (
                  <>
                    <div className="nftbox animate__animated animate__flipInY">
                      <div className="nft active">
                        <img className="nftimg" src={metadata.image} alt="" />
                        <p className="network">
                          <NetworkRequire />
                        </p>
                      </div>
                      <p className="name">{metadata.name}</p>
                      <p className="level active">level: {metadata.level + 1}</p>
                    </div>
                    <div className="linkbox animate__animated animate__fadeIn">
                      <Link href={L2SetValueTX} isExternal>
                        L2 Set Value tx
                      </Link>
                    </div>
                    <Button width="100%" bg="#2828b2" isLoading={isLoading} onClick={toConfirm}>
                      Confirm
                    </Button>
                  </>
                ) : (
                  <div className="nftbox animate__animated animate__fadeIn">
                    <div className="nft">
                      <img className="nftimg" src={metadata.image} alt="" />
                      <p className="network">
                        <NetworkRequire />
                      </p>
                    </div>
                    <p className="name">{metadata.name}</p>
                    <p className="level">
                      <span>level: {metadata.level}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {stepIndex == 5 && (
        <div className="rowbox animate__animated animate__zoomIn">
          <BorderAngular />
          <div className="box">
            <div className="title">State settlement succeed</div>
            <div className="text">My NFTS: </div>
            {metadata && (
              <div className="nftbox">
                <div className="nft active">
                  <img className="nftimg" src={metadata.image} alt="" />
                  <p className="network">{Devnet.label}</p>
                </div>
                <p className="name">{metadata.name}</p>
                <p className="symbol">{metadata.symbol}</p>
                <p className="description">{metadata.description}</p>
                <p className="level active">level: {metadata.level + 1}</p>
              </div>
            )}
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
                  <p className="network">{Devnet.label}</p>
                </div>
                <p className="name">{metadata.name}</p>
                <p className="symbol">{metadata.symbol}</p>
                <p className="description">{metadata.description}</p>
                <p className="level">level: {metadata.level}</p>
                <div className="linkbox">
                  <Link href={mintNftTX} isExternal>
                    Mint NFT TX
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

      <Modal isOpen={isOpenUpgradeSuccess} onClose={closeUpgradeSuccess}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>HyperGrid Network receives upgrade request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="linkbox">
              <Link href={L2SetValueTX} isExternal>
                L2 Set Value TX
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
