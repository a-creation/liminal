// import React from 'react';
// import { Link } from 'react-router-dom';
// import './RedeemPage.css';

// const SellPage = () => {
//     return (
//         <div align="center">
//             <h1>Sell Solana Index Tokens</h1>
//             <p>Amount:</p>
//             <input/>
//             <button>Sell</button>
//             <br/>
//             <button id="sell-go-back-button">
//                 <Link id="sell-go-back-button-link" to="/">Go Back</Link>
//             </button>
//         </div>
//     )
// }

// export default SellPage

import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./RedeemPage.css";
import "./globals.css";
import { web3, Provider, setProvider } from '@project-serum/anchor';
import { ConnectionContext, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import tokenMints from './utils/tokens'
import idl from './utils/liminal.json'
import * as anchor from '@project-serum/anchor';

const programId = "3tcZUbsj9mcBJGVuEqPbc8TrbehYMpqucVAsNZP6Z4rN"

function SellPage() {

  const [SDIAmount, setSDI] = useState('')
  const [SDIDesiredAmount, setSDIDesired] = useState('')
  const [amountInSet, setAmounts] = useState([6.75,3.8,3.65,2,1.15,0.45])
  const tickers = ["SRM", "RAY", "SBR", "ORCA", "SLND", "MNDE"];
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();

  useEffect(()=>{
      getSDIBalance();
  }, []);

  const redeemData = {
    liminalprotocol1: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6249047feb3325afc1883df0/img/liminalprotocol-1@2x.png",
    redeemSolanaDefiIndex: "Redeem Solana DeFi Index",
    liminalCircle21: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle2-1@2x.png",
    number: "42",
    currentSdiBalance: "Current SDI balance",
    sdi: "SDI",
    token: "Token",
    amountPerSet: "Amount per set",
    youReceive: "You Receive",
    liminalCircle11: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle-1@2x.png",
    serum: "Serum",
    liminalCircle12: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle-1-1@2x.png",
    raydium: "Raydium",
    liminalCircle13: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle-1-2@2x.png",
    saber: "Saber",
    liminalCircle14: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle-1-3@2x.png",
    orca1: "Orca",
    liminalCircle15: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle-1-4@2x.png",
    solend: "Solend",
    liminalCircle16: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle-1-5@2x.png",
    marinade: "Marinade",
    text1: "6.75",
    text2: "3.80",
    text3: "3.65",
    text4: "2.00",
    text5: "1.15",
    text6: "0.45",
    srm: "SRM",
    name: "RAY",
    sbr: "SBR",
    orca2: "ORCA",
    slnd: "SLND",
    mnde: "MNDE",
    redeem: "Redeem",
    place: "Back",
  };

  const {
    liminalprotocol1,
    redeemSolanaDefiIndex,
    liminalCircle21,
    number,
    currentSdiBalance,
    sdi,
    token,
    amountPerSet,
    youReceive,
    liminalCircle11,
    serum,
    liminalCircle12,
    raydium,
    liminalCircle13,
    saber,
    liminalCircle14,
    orca1,
    liminalCircle15,
    solend,
    liminalCircle16,
    marinade,
    text1,
    text2,
    text3,
    text4,
    text5,
    text6,
    srm,
    name,
    sbr,
    orca2,
    slnd,
    mnde,
    redeem,
    place,
  } = redeemData;

  const getSDIBalance = async () => {
    if(publicKey && connection){
        if (!publicKey) throw new WalletNotConnectedError();
        let pk = new web3.PublicKey(publicKey);

        let indexmint = new web3.PublicKey(tokenMints[0])
        // for(const tokenMint of tokenMints){
        //   let mint = new web3.PublicKey(tokenMint)
        let accounts = await connection.getParsedTokenAccountsByOwner(pk, { mint: indexmint });
        console.log('accounts', accounts)

        if(accounts.value[0]){
            let balance = await connection.getTokenAccountBalance(accounts.value[0].pubkey)
            setSDI(balance.value.amount/LAMPORTS_PER_SOL)
            console.log(balance.value.amount/LAMPORTS_PER_SOL)
        } else {
            console.log('no value')
        }
    }

    // }
  }

    const getProvider = async () => {
        /* create the provider and return it to the caller */
        /* network set to local network for now */
        // const network = "https://api.devnet.solana.com";
        // const connection = new web3.Connection(network, "processed");

        const provider = new Provider(
        connection, wallet, "processed",
        );
        return provider;
    }

    const redeemFunction = async () => {
        console.log('redeem')
        const provider = await getProvider();

        const program = new anchor.Program(idl, programId, provider);

        console.log('here', program.programId)
        // let authority
        // let bumpSeed
        // [authority, bumpSeed] = await web3.PublicKey.findProgramAddress(
        //   [ammAccount.publicKey.toBuffer()],
        //   program.programId
        // );
        let to = web3.Keypair.generate();

        await program.rpc.initialize()
        // let transaction = new web3.Transaction().add(
        //   web3.SystemProgram.transfer({
        //       fromPubkey: wallet.publicKey,
        //       toPubkey: to.publicKey,
        //       lamports: web3.LAMPORTS_PER_SOL / 100,
        //   })
        // );

        // console.log('hello', transaction)

        // let signature = await web3.sendAndConfirmTransaction(
        //   connection,
        //   transaction,
        //   [wallet.publicKey]
        // );
        // console.log('signature', signature)

    }

  return (
    <div className="container-center-horizontal" style={{backgroundColor:"#f8f8f8"}}>
      <div className="redeem-0 screen">
        <img className="liminalprotocol-1" src={liminalprotocol1} />
        <div className="flex-col-0">
          <h1 className="title-0 inter-semi-bold-black-24px">{redeemSolanaDefiIndex}</h1>
          <img className="liminal-circle2-1-0" src={liminalCircle21} />
          <div className="number-0 inter-semi-bold-black-24px">{SDIAmount}</div>
          <div className="current-sdi-balance inter-medium-mountain-mist-20px">{currentSdiBalance}</div>
          <img
            className="how-many-sdi-sets-wo"
            src="https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/how-many-sdi-sets-would-you-like-to-redeem-@2x.svg"
          />
          {/* <div className="overlap-group2-0">
            <input/> todo
            <div className="sdi">{sdi}</div>
            <div>HELLO</div>
          </div> */}
          <input style={{height:"60px", width:"200px", marginTop:'20px', borderRadius:"10px", fontSize:"30px", textAlign:'center', borderStyle:"solid", borderColor: '#d1d1d1', borderWidth:"2px"}} placeholder={'SDI'} value={SDIDesiredAmount} onChange={(e)=>{setSDIDesired(e.target.value)}}></input>
          <div className="flex-col-1">
            <div className="flex-col-2">
              <div className="header inter-semi-bold-mountain-mist-17-9px">
                <div className="token-0">{token}</div>
                <div className="overlap-group-0">
                  <div className="amount-per-set-0">{amountPerSet}</div>
                  <div className="you-receive">{youReceive}</div>
                </div>
              </div>
              <div className="rectangle-9-0"></div>
            </div>
            <div className="flex-row-0">
              <div className="flex-row-1">
                <div className="label-container">
                  <div className="serum-label-0">
                    <img className="liminal-circle-1-0" src={liminalCircle11} />
                    <div className="serum-0 inter-semi-bold-black-15-4px">{serum}</div>
                  </div>
                  <div className="raydium-label-0">
                    <img className="liminal-circle-1-1-0" src={liminalCircle12} />
                    <div className="raydium-0 inter-semi-bold-black-15-4px">{raydium}</div>
                  </div>
                  <div className="saber-label-0">
                    <img className="liminal-circle-1-2" src={liminalCircle13} />
                    <div className="saber-0 inter-semi-bold-black-15-4px">{saber}</div>
                  </div>
                  <div className="saber-label-1-0">
                    <img className="liminal-circle-1-3" src={liminalCircle14} />
                    <div className="orca-0 inter-semi-bold-black-15-4px">{orca1}</div>
                  </div>
                  <div className="solend-label-0">
                    <img className="liminal-circle-1-4" src={liminalCircle15} />
                    <div className="solend-0 inter-semi-bold-black-15-4px">{solend}</div>
                  </div>
                  <div className="solend-label-1-0">
                    <img className="liminal-circle-1-5" src={liminalCircle16} />
                    <div className="marinade-0 inter-semi-bold-black-15-4px">{marinade}</div>
                  </div>
                </div>
                <div className="text-container inter-normal-black-15-4px">
                  <div className="text-1">{text1}</div>
                  <div className="text-2">{text2}</div>
                  <div className="text-3">{text3}</div>
                  <div className="text-4">{text4}</div>
                  <div className="text-5">{text5}</div>
                  <div className="text-6">{text6}</div>
                </div>
              </div>
              <div className="flex-col-3 inter-normal-black-15-4px">
              {/* Update "You Receive" values here */}
                <div className="srm-0">{(SDIDesiredAmount * amountInSet[0]).toFixed(2) + " " + tickers[0]}</div>
                <div className="flex-col-item">{(SDIDesiredAmount * amountInSet[1]).toFixed(2) + " " + tickers[1]}</div>
                <div className="sbr-0">{(SDIDesiredAmount * amountInSet[2]).toFixed(2) + " " + tickers[2]}</div>
                <div className="orca-1-0">{(SDIDesiredAmount * amountInSet[3]).toFixed(2) + " " + tickers[3]}</div>
                <div className="flex-col-item">{(SDIDesiredAmount * amountInSet[4]).toFixed(2) + " " + tickers[4]}</div>
                <div className="mnde-0">{(SDIDesiredAmount * amountInSet[5]).toFixed(2) + " " + tickers[5]}</div>
              {/* ==================================== */}
              </div>
            </div>
          </div>
          <div className="overlap-group-1">
            <button className="redeem-1" style={{backgroundColor: 'transparent', outline:"none", borderStyle:"none"}} onClick={redeemFunction}>Redeem</button>
          </div>
          <div className="place-0 inter-medium-mountain-mist-20px">
            <Link to="/">Back</Link>
          </div>
          {/* <div className="">Back</div> */}
        </div>
      </div>
    </div>
  );
}

export default SellPage;

