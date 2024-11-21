use anchor_lang::prelude::*;

declare_id!("ESMcDD8o6J6bACL7m41qA4A4gEjmsoGpDJYA7F12fJR6");

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
