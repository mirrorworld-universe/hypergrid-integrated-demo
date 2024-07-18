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

  it("fetch nft", async () => {
    // Fetch the created account
    const newMint = await program.account.mint.fetch("REPLACE_ACCOUNT");

    console.log("NFT name is:", newMint.name.toString());
    console.log("NFT uri is:", newMint.uri.toString());
    console.log("NFT level is:", newMint.level.toString());
    console.log("NFT locker is:", newMint.locker.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(metadata.name == newMint.name);
    expect(metadata.uri == newMint.uri);
    expect(metadata.level.eq(newMint.level));
  }).timeout(15000);
});
