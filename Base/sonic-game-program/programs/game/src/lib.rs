use anchor_lang::prelude::*;

declare_id!("GjyDWR6kKxF9p4tECMi3Fq8E9wKGzAmtveuzKk3DN3TD");

#[program]
pub mod game {
    use super::*;

    pub fn addlog(_ctx: Context<AddLog>, game: u64, log: String) -> Result<()> {
        msg!("New Log Added");
        msg!("Game: {}", game);
        msg!("Log: {}", log);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddLog<'info> {
    pub user: Signer<'info>,
}
