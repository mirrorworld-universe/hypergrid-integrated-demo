import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Inbox } from "../target/types/inbox";
import { expect } from "chai"

describe("inbox", async () => {
  // Configured the client to use the devnet cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace
    .Inbox as Program<Inbox>;

  const block = anchor.web3.Keypair.generate();
  const blockData = {
    slot: new BN(47091),
    hash: "EJ2YT7T8UNLRefn9KibZ1yLRWLp8oeBuoQN1PLzdLh8n",
  };

  it("add l2 block", async () => {
    const tx = await program.methods
      .addblock(blockData.slot, blockData.hash)
      .accounts({
        block: block.publicKey,
        // user: provider.publicKey,
        // systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([block])
      .rpc();

    // Fetch the created account
    const newBlock = await program.account.block.fetch(block.publicKey);

    console.log("Block slot is:", newBlock.slot.toString());
    console.log("Block hash is:", newBlock.hash.toString());

    // Check whether the data on-chain is equal to local 'data'
    expect(blockData.slot.eq(newBlock.slot));
    expect(blockData.hash == newBlock.hash);

    console.log(
      `add l2 block tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
    );
    console.log(
      `block acount: https://explorer.solana.com/address/${block.publicKey}?cluster=devnet`
    );
  });
});
