use anchor_lang::prelude::*;

declare_id!("5XJ1wZkTwAw9mc5FbM3eBgAT83TKgtAGzKos9wVxC6my");

#[program]
pub mod inbox {
    use super::*;

    pub fn addblock(ctx: Context<AddBlock>, slot: u64, hash: String) -> Result<()> {
        let block: &mut _ = &mut ctx.accounts.block;
        block.slot = slot;
        block.hash = hash;
        msg!("Block Account Created");
        msg!("Block Slot: { }", block.slot);
        msg!("Block Hash: { }", block.hash);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddBlock<'info> {
    #[account(init, payer = user, space = 8 + 8 + 4 + 200)]
    pub block: Account<'info, Block>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Block {
    pub slot: u64,
    pub hash: String
}