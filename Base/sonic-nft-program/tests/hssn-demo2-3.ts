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

  const metadata = {
    name: "Sonic NFT",
    uri: "https://bafybeieknoava43popez3aroo6umnv24gwy75jfvlcpsoz57ebvqpj5y54.ipfs.nftstorage.link/1.json",
    level: new BN(1),
  };

  const mintPublicKey = "REPLACE_ACCOUNT";

  it("set locker", async () => {
    const tx = await program.methods
      .setlocker(provider.publicKey)
      .accounts({
        mint: mintPublicKey
      })
      .rpc();

    // Fetch the created account
    const newMint = await program.account.mint.fetch(mintPublicKey);

    console.log("NFT locker is:", newMint.locker.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(provider.publicKey.equals(newMint.locker));

    console.log(
      `set locker tx: https://explorer.sonic.game/tx/${tx}?cluster=custom&customUrl=https%3A%2F%2Fgrid-1.hypergrid.dev`
    );
    console.log(
      `mint acount: https://explorer.sonic.game/address/${mintPublicKey}?cluster=custom&customUrl=https%3A%2F%2Fgrid-1.hypergrid.dev`
    );
  }).timeout(15000);

  it("set value", async () => {
    // Fetch the created account
    const oldMint = await program.account.mint.fetch(mintPublicKey);

    console.log("NFT old value is:", oldMint.level.toString());

    const newLevel = new BN(2);

    const tx = await program.methods
      .setvalue(newLevel)
      .accounts({
        mint: mintPublicKey
      })
      .rpc();

    // Fetch the created account
    const newMint = await program.account.mint.fetch(mintPublicKey);

    console.log("NFT new value is:", newMint.level.toString());
    console.log("NFT locker is:", newMint.locker.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(newLevel.eq(newMint.level));
    expect(newMint.locker.toString() == '11111111111111111111111111111111');

    console.log(
      `set value tx: https://explorer.sonic.game/tx/${tx}?cluster=custom&customUrl=https%3A%2F%2Fgrid-1.hypergrid.dev`
    );
    console.log(
      `mint acount: https://explorer.sonic.game/address/${mintPublicKey}?cluster=custom&customUrl=https%3A%2F%2Fgrid-1.hypergrid.dev`
    );
  }).timeout(15000);
});
