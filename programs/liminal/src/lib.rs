use anchor_lang::prelude::*;
// use anchor_lang::solana_program::program_option::COption;
use anchor_spl::token::{self, Mint, Burn, MintTo, TokenAccount, Transfer};
// use anchor_lang::system_program::Transfer;

/*
pub mod curve;
use crate::curve::{
    base::SwapCurve,
    calculator::{CurveCalculator, RoundDirection, TradeDirection},
    fees::CurveFees,
};
use crate::curve::{
    constant_price::ConstantPriceCurve, constant_product::ConstantProductCurve,
    offset::OffsetCurve, stable::StableCurve,
};
*/

declare_id!("3tcZUbsj9mcBJGVuEqPbc8TrbehYMpqucVAsNZP6Z4rN");

#[program]
pub mod liminal {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    // // find_program_address iteratively calls create_program_address until valid
    //     // basically create swap_authority acccount
    //     // bump seed lets you later reference this program
    //     let (swap_authority, bump_seed) = Pubkey::find_program_address(
    //         &[&ctx.accounts.amm.to_account_info().key.to_bytes()],
    //         ctx.program_id,

    pub fn mint_index(ctx: Context<MintIndex>, amount_in: u64) -> Result<()> {

        let user_token_1 = &ctx.accounts.user_token_1;
        // let user_token_2 = &ctx.accounts.user_token_2;
        // let user_token_3 = &ctx.accounts.user_token_3;

        let program_token_1 = &ctx.accounts.program_token_1;
        // let program_token_2 = &ctx.accounts.program_token_2;
        // let program_token_3 = &ctx.accounts.program_token_3;

        let user_index_acc = &ctx.accounts.user_index_acc;
        // let program_index_acc = &ctx.accounts.program_index_acc;
        let index_token_mint = &ctx.accounts.index_token_mint;

        let program_authority = &ctx.accounts.program_authority;
        let user_transfer_authority = &ctx.accounts.user_transfer_authority;

        let token_program = &ctx.accounts.token_program;

        let transferamount = 1;
        let mintamount = 1;

        // First, transfer from user's token1 account to program's token1 account
        token::transfer(
            CpiContext::new(
                token_program.to_account_info(),
                Transfer {
                    from: user_token_1.to_account_info(),
                    to: program_token_1.to_account_info(),
                    authority: user_transfer_authority.to_account_info(),
                },
            ),
            transferamount,
        )?;
        
        // Next, mint indexToken into program's indexToken account
        token::mint_to(
            CpiContext::new(
                token_program.to_account_info(),
                MintTo {
                    mint: index_token_mint.to_account_info(),
                    to: user_index_acc.to_account_info(),
                    authority: program_authority.to_account_info(),
                }
            ),
            mintamount,
        )?;

        // Next, transfer from program's indexToken account to user's indexToken account
        // token::transfer(
        //     CpiContext::new(
        //         token_program.to_account_info(),
        //         Transfer {
        //             from: program_index_acc.to_account_info(),
        //             to: user_index_acc.to_account_info(),
        //             authority: user_transfer_authority.to_account_info(),
        //         },
        //     ),
        //     amount,
        // )

        Ok(())
    }



    pub fn redeem_index(ctx: Context<RedeemIndex>, amount_in: u64) -> Result<()> {
        // when a user wants to redeem
        // assuming everything to valid

        let user_token_1 = &ctx.accounts.user_token_1;
        // let user_token_2 = &ctx.accounts.user_token_2;
        // let user_token_3 = &ctx.accounts.user_token_3;

        let program_token_1 = &ctx.accounts.program_token_1;
        // let program_token_2 = &ctx.accounts.program_token_2;
        // let program_token_3 = &ctx.accounts.program_token_3;

        let user_index_acc = &ctx.accounts.user_index_acc;
        // let program_index_acc = &ctx.accounts.program_index_acc;
        let index_token_mint = &ctx.accounts.index_token_mint;

        // let program_authority = &ctx.accounts.program_authority;
        // let user_transfer_authority = &ctx.accounts.user_transfer_authority;

        let token_program = &ctx.accounts.token_program;

        let transferamount = 1;
        let mintamount = 1;

        // Transfer index token from 

        // token::transfer(
        //     CpiContext::new(
        //         token_program.to_account_info(),
        //         Transfer {
        //             from: user_index_acc.to_account_info(),
        //             to: program_token_1.to_account_info(),
        //             authority: user_transfer_authority.to_account_info(),
        //         },
        //     ),
        //     transferamount,
        // )?;

        Ok(())
    }
}

// context
// tokens a-
// fn into_transfer_to_token_a_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
//     let cpi_accounts = Transfer {
//         from: self.token_a.to_account_info().clone(),
//         to: self.dest_token_a_info.clone(),
//         authority: self.authority.clone(),
//     };
//     CpiContext::new(self.token_program.clone(), cpi_accounts)
// }

// #[derive(Accounts)]
// pub struct Initialize<'info> {
//     authority: Signer<'info>,
//     #[account(init, seeds = [authority.key().as_ref(), ]), 
//         bump, payer = authority()]
// }

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct MintIndex<'info> {
    /// CHECK: Not dangerous
    pub program_authority: AccountInfo<'info>,
    /// CHECK: Not dangerous
    #[account(signer)]
    pub user_transfer_authority: AccountInfo<'info>,
    #[account(mut)]
    pub user_token_1: Account<'info, TokenAccount>,
    // #[account(mut)]
    // pub user_token_2: Account<'info, TokenAccount>,
    // #[account(mut)]
    // pub user_token_3: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_token_1: Account<'info, TokenAccount>,
    // #[account(mut)]
    // pub program_token_2: Account<'info, TokenAccount>,
    // #[account(mut)]
    // pub program_token_3: Account<'info, TokenAccount>,
    // #[account(mut)]
    // pub program_index_acc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_index_acc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub index_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub fee_account: Account<'info, TokenAccount>,
    /// CHECK: Not dangerous
    pub token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RedeemIndex<'info>{
    #[account(mut)]
    pub user_token_1: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_2: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_3: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_token_1: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_token_2: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_token_3: Account<'info, TokenAccount>,
    #[account(mut)]
    pub program_index_acc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_index_acc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub index_token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub fee_account: Account<'info, TokenAccount>,
    /// CHECK: Not dangerous
    pub token_program: AccountInfo<'info>,
}




// #[account]
// #[derive(Default)]
// pub struct MintIndexToken {

// }






// pub fn mint_to<'a, 'b, 'c, 'info>(
//     ctx: CpiContext<'a, 'b, 'c, 'info, MintTo<'info>>,
//     amount: u64,
// ) -> Result<()> {
//     let ix = spl_token::instruction::mint_to(
//         &spl_token::ID,
//         ctx.accounts.mint.key,
//         ctx.accounts.to.key,
//         ctx.accounts.authority.key,
//         &[],
//         amount,
//     )?;
//     solana_program::program::invoke_signed(
//         &ix,
//         &[
//             ctx.accounts.to.clone(),
//             ctx.accounts.mint.clone(),
//             ctx.accounts.authority.clone(),
//         ],
//         ctx.signer_seeds,
//     )
//     .map_err(Into::into)
// }