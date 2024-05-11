use anchor_lang::prelude::*;

declare_id!("4WTUyXNcf6QCEj76b3aRDLPewkPGkXFZkkyf3A3vua1z");

#[program]
pub mod hgnft {
    use super::*;

    pub fn mintnft(ctx: Context<MintNFT>, name: String, uri: String, level: u64) -> Result<()> {
        let mint: &mut _ = &mut ctx.accounts.mint;
        mint.name = name;
        mint.uri = uri;
        mint.level = level;
        msg!("Mint Account Created");
        msg!("NFT Name: { }", mint.name);
        msg!("NFT Uri: { }", mint.uri);
        msg!("NFT Level: { }", mint.level);
        msg!("NFT Locker: { }", mint.locker);
        Ok(())
    }

    pub fn setlocker(ctx: Context<SetLocker>, locker: Pubkey) -> Result<()> {
        let mint: &mut _ = &mut ctx.accounts.mint;
        mint.locker = locker;
        msg!("NFT Set Locker");
        msg!("NFT Locker: { }", mint.locker);
        Ok(())
    }

    pub fn setvalue(ctx: Context<SetValue>, level: u64) -> Result<()> {
        let mint: &mut _ = &mut ctx.accounts.mint;
        msg!("NFT Set Value");
        msg!("NFT Old Value: { }", mint.level);
        mint.level = level;
        msg!("NFT New Value: { }", mint.level);
        mint.locker = Pubkey::default();
        msg!("NFT Locker: { }", mint.locker);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(init, payer = user, space = 8 + 4 + 200 + 4 + 200 + 8 + 32)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetLocker<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetValue<'info> {
    #[account(mut, has_one = locker)]
    pub mint: Account<'info, Mint>,
    pub locker: Signer<'info>,
}

#[account]
pub struct Mint {
    pub name: String,
    pub uri: String,
    pub level: u64,
    pub locker: Pubkey,
}
