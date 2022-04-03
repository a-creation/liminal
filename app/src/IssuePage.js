import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './IssuePage.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

// ['serum', 'raydium', 'saber', 'orca', 'solend', 'marinade']

const BuyPage = () => {

    const { connection } = useConnection();
    const { publicKey } = useWallet();

    useEffect(() => {
        getAccountInfo();
    });

    const getAccountInfo = async () => {
        // console.log("wallet", wallet)
        if(publicKey && connection){
            if (!publicKey) throw new WalletNotConnectedError();
            let pk = new web3.PublicKey(publicKey);
            // let mint = new web3.PublicKey("7FZYHqmJLAkGgZxqhLDjmwCh5LV58mx3jiAQAW8zxgEX")
            let accountInfo = await connection.getAccountInfo(pk);
            // let key = await connection.getParsedTokenAccountsByOwner(pk, { mint: mint });
            // console.log('acc', key)
            // console.log('balance', key.value[0].pubkey)
            // console.log("here", await connection.getTokenAccountBalance(key.value[0].pubkey))
            //   setSol(accountInfo.lamports/LAMPORTS_PER_SOL);
            console.log(accountInfo.lamports/LAMPORTS_PER_SOL)
        }
    }

    return (
        <div align="center">
            <h1>Buy Tokens</h1>
            <div>
                <p>Serum SRM<img src="https://s2.coinmarketcap.com/static/img/coins/16x16/6187.png" /><button>Approve</button></p><br />
                <p>Raydium RAY<img src="https://s2.coinmarketcap.com/static/img/coins/16x16/8526.png" /><button>Approve</button></p><br />
                <p>Saber SBR<img src="https://s2.coinmarketcap.com/static/img/coins/16x16/11181.png" /><button>Approve</button></p><br />
                <p>Orca ORCA<img src="https://s2.coinmarketcap.com/static/img/coins/16x16/11165.png" /><button>Approve</button></p><br />
                <p>Solend SLND<img src="https://s2.coinmarketcap.com/static/img/coins/16x16/13524.png" /><button>Approve</button></p><br />
                <p>Marinade MNDE<img src="https://s2.coinmarketcap.com/static/img/coins/16x16/13803.png" /><button>Approve</button></p><br />
            </div>
            <button>Purchase</button>
            <br />
            <button id="buy-go-back-button">
                <Link id="buy-go-back-button-link" to="/">Go Back</Link>
            </button>
        </div>
    )
}

export default BuyPage
