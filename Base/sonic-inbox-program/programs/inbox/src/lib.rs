use anchor_lang::prelude::*;

declare_id!("5XJ1wZkTwAw9mc5FbM3eBgAT83TKgtAGzKos9wVxC6my");

#[program]
pub mod inbox {
    use super::*;

    pub fn addblock(ctx: Context<AddBlock>, slot: u64, hash: String, from: String) -> Result<()> {
        msg!("New Block Added");
        msg!("Block Slot: {}", slot);
        msg!("Block Hash: {}", hash);
        msg!("Block From: {}", from);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddBlock<'info> {
    pub user: Signer<'info>,
}
