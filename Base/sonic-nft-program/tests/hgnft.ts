import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Hgnft } from "../target/types/hgnft";
import { expect } from "chai"

describe("hgnft", async () => {
  // Configured the client to use the devnet cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace
    .Hgnft as Program<Hgnft>;

  const mint = anchor.web3.Keypair.generate();
  const metadata = {
    name: "Kobeni",
    uri: "https://raw.githubusercontent.com/687c/solana-nft-native-client/main/metadata.json",
    level: new BN(1),
  };

  it("mint nft", async () => {
    const tx = await program.methods
      .mintnft(metadata.name, metadata.uri, metadata.level)
      .accounts({
        mint: mint.publicKey
      })
      .signers([mint])
      .rpc();

    // Fetch the created account
    const newMint = await program.account.mint.fetch(mint.publicKey);

    console.log("NFT name is:", newMint.name.toString());
    console.log("NFT uri is:", newMint.uri.toString());
    console.log("NFT level is:", newMint.level.toString());
    console.log("NFT locker is:", newMint.locker.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(metadata.name == newMint.name);
    expect(metadata.uri == newMint.uri);
    expect(metadata.level.eq(newMint.level));

    console.log(
      `mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
    console.log(
      `mint acount: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
    );
  });

  it("set locker", async () => {
    const tx = await program.methods
      .setlocker(provider.publicKey)
      .accounts({
        mint: mint.publicKey
      })
      .rpc();

    // Fetch the created account
    const newMint = await program.account.mint.fetch(mint.publicKey);

    console.log("NFT locker is:", newMint.locker.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(provider.publicKey.equals(newMint.locker));

    console.log(
      `set locker tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
    console.log(
      `mint acount: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
    );
  });

  it("set value", async () => {
    // Fetch the created account
    const oldMint = await program.account.mint.fetch(mint.publicKey);

    console.log("NFT old value is:", oldMint.level.toString());

    const newLevel = new BN(2);

    const tx = await program.methods
      .setvalue(newLevel)
      .accounts({
        mint: mint.publicKey
      })
      .rpc();

    // Fetch the created account
    const newMint = await program.account.mint.fetch(mint.publicKey);

    console.log("NFT new value is:", newMint.level.toString());
    console.log("NFT locker is:", newMint.locker.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(newLevel.eq(newMint.level));
    expect(newMint.locker.toString() == '11111111111111111111111111111111');

    console.log(
      `set value tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
    console.log(
      `mint acount: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
    );
  });

  it("set value again without lock", async () => {
    // Fetch the created account
    const oldMint = await program.account.mint.fetch(mint.publicKey);

    console.log("NFT old value is:", oldMint.level.toString());

    const newLevel = new BN(3);

    const tx = await program.methods
      .setvalue(newLevel)
      .accounts({
        mint: mint.publicKey
      })
      .rpc();

    // Fetch the created account
    const newMint = await program.account.mint.fetch(mint.publicKey);

    console.log("NFT new value is:", newMint.level.toString());
    console.log("NFT locker is:", newMint.locker.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(newLevel.eq(newMint.level));
    expect(newMint.locker.toString() == '11111111111111111111111111111111');

    console.log(
      `set value tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
    console.log(
      `mint acount: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
    );
  });
});
