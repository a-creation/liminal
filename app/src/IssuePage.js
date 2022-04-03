import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./RedeemPage.css";
import "./globals.css";
import { web3, Provider, setProvider, AnchorError } from '@project-serum/anchor';
import { ConnectionContext, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import tokenMints from './utils/tokens'
import idl from './utils/liminal.json'
import * as anchor from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getMint, transfer, createMint } from '@solana/spl-token';

const programId = "3tcZUbsj9mcBJGVuEqPbc8TrbehYMpqucVAsNZP6Z4rN"

function BuyPage() {

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
    redeemSolanaDefiIndex: "Mint Solana DeFi Index",
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
    const issueFunction = async () => {

      console.log('wallet.publicKey', wallet)
      const keypair = anchor.web3.Keypair.generate();

      let pk = new web3.PublicKey(wallet.publicKey);

      
      let index_mint = await createMint(connection, keypair, pk, null, 2, TOKEN_PROGRAM_ID)

      let accounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { mint: index_mint });

      let userindextoken
      if(accounts.value[0]){
        userindextoken = accounts.value[0].pubkey 
        // or . push^
        let balance = await connection.getTokenAccountBalance(accounts.value[0].pubkey)
        console.log(balance.value.amount/LAMPORTS_PER_SOL)
      } else {
        userindextoken = await index_mint.createAccount(wallet.publicKey)
      }

      await index_mint.mintTo(userindextoken, wallet.publicKey, [])


      // transfer(connection, wallet.publicKey, )
      // console.log('issue')
      // const provider = await getProvider();

      // const program = new anchor.Program(idl, programId, provider);
      // const program_account = anchor.web3.Keypair.generate();
      // let authority
      // let bumpSeed
      // [authority, bumpSeed] = await web3.PublicKey.findProgramAddress(
      //   [program_account.publicKey.toBuffer()],
      //   program.programId
      // );

      // console.log('here', program.programId, wallet.publicKey)
      // console.log('yo', authority)

      // // const mintPublicKey = new web3.PublicKey(tokenMints[0])

      // let indexmint
      // let userindexacc
      // let usertokenaccount
      // for(let i=0; i<tokenMints.length; i++){
      //   let tokenMint = tokenMints[i]
      // let index_mint = new web3.PublicKey(tokenMints[0])
      // let accounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { mint: index_mint });
      //   console.log('accounts', accounts)
        
      //   if(i == 0 && accounts.value[0]){
      //     indexmint = mint
      //     userindexacc = accounts.value[0].pubkey 
      //     continue
      //   }
      // let userindextoken
      // if(accounts.value[0]){
      //   userindextoken = accounts.value[0].pubkey 
      //   // or . push^
      //   let balance = await connection.getTokenAccountBalance(accounts.value[0].pubkey)
      //   console.log(balance.value.amount/LAMPORTS_PER_SOL)
      // } else {
      //   userindextoken = await mint.createAccount(wallet.publicKey)
      // }

      // await index_mint.mintTo(userindextoken, )
      //   } else {
      //     console.log('no value')
      //   }
  
      // }
      // // let accounts = await connection.getParsedTokenAccountsByOwner(pk, { mint: mint });
      // // let mint = await getMint(connection, mintPublicKey)

      // // indexTokenAcc = await mint.createAccount()
      // // // let userIndexAcc = await mintPublicKey.createAccount(wallet) 
      // // console.log('mint',mint)

      // // // let mint = new web3.PublicKey(tokenMint)
      // // let accounts = await connection.getParsedTokenAccountsByOwner(pk, { mint: mint });
      // // console.log('accounts', accounts)

      // // if(accounts.value[0]){
      // //   let balance = await connection.getTokenAccountBalance(accounts.value[0].pubkey)
      // //   console.log(balance.value.amount/LAMPORTS_PER_SOL)
      // // } else {
      // //   console.log('no value')
      // // }
      // // const mintToken = new Token(
      // //   connection,
      // //   mintPublicKey,
      // //   TOKEN_PROGRAM_ID,
      // //   wallet // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
      // // );

      // // console.log('mintPublicKey', mintPublicKey)


      // // let authority
      // // let bumpSeed
      // // [authority, bumpSeed] = await web3.PublicKey.findProgramAddress(
      // //   [ammAccount.publicKey.toBuffer()],
      // //   program.programId
      // // );

      // // await program.rpc.initialize()
      // let tx = await program.rpc.mintIndex(
      //   new anchor.BN(1),
      //   {
      //     accounts: {
      //       programAuthority: authority,
      //       userTransferAuthority: wallet.publicKey,
      //       userToken1: usertokenaccount,
      //       programToken1: program_account.publicKey,
      //       userIndexAcc: userindexacc,
      //       indexTokenMint: indexmint,
      //       feeAccount: wallet.publicKey,
      //       tokenProgram: TOKEN_PROGRAM_ID
      //     }
      //   })
      // console.log('tx', tx)


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
            src="https://cdn.animaapp.com/projects/61d5fb6479d2de012a81c2e8/releases/6249341e5a6aa9dce5d81169/img/how-many-sdi-sets-would-you-like-to-mint-@2x.svg"
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
            <button className="redeem-1" style={{backgroundColor: 'transparent', outline:"none", borderStyle:"none"}} onClick={issueFunction}>Mint</button>
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

export default BuyPage;

