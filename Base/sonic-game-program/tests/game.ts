import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Game } from "../target/types/game";
import { expect } from "chai"

describe("game", async () => {
  // Configured the client to use the devnet cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace
    .Game as Program<Game>;

  const LogData = {
    game: new BN(1),
    log: "Snake moves to X:360, Y:0"
  };

  it("add game log", async () => {
    const tx = await program.methods
      .addlog(LogData.game, LogData.log)
      .rpc();

    // Fetch the created account
    // const newBlock = await program.account.block.fetch(block.publicKey);

    // console.log("Block slot is:", newBlock.slot.toString());
    // console.log("Block hash is:", newBlock.hash.toString());

    // Check whether the data on-chain is equal to local 'data'
    // expect(blockData.slot.eq(newBlock.slot));
    // expect(blockData.hash == newBlock.hash);

    console.log(
      `add log tx: https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=https%3A%2F%2Fnative-rpc.sonic.game`
    );
  });
});
