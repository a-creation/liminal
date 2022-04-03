import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useState, useEffect } from "react";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import * as web3 from '@solana/web3.js';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';


export const ConnectPhantomView = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  // const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');

  const buttonStyle =  {backgroundColor: "white", borderRadius: "10px", color: "#2abdd2", height: "25px", width: "100px", border: "0px", marginTop: "10px", marginLeft: "5px", marginRight: "5px"};
  const groupStyle = {display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "100px"}
  const topBar = {display: "flex", flexDirection: "row", marginTop: "20px", marginLeft: "50px"}
  const [activeTab, setActiveTab] = useState("trade");
  const [sol, setSol] = useState("0.000");

  useEffect(() => {
    getAccountInfo();
  });

  const getAccountInfo = async () => {
    // console.log("wallet", wallet)
    if(publicKey && connection){
      if (!publicKey) throw new WalletNotConnectedError();
      let pk = new web3.PublicKey(publicKey);
      let accountInfo = await connection.getAccountInfo(pk);
      console.log("!!!!")
      console.log('acc', accountInfo)
      setSol(accountInfo.lamports/LAMPORTS_PER_SOL);
    }
  }

  return (
    // <button onClick={() => {
    //   console.log("clicked")
    // }}>Connect Wallet</button>
    <>
      <div style={topBar}>
        
        {connection && <div style={{color: "white", fontFamily: "sans-serif"}}>
          SOL Balance: {sol}
        </div>}
      </div>
      <div style={groupStyle}>
        <button id="trade" onClick={(e)=>{setActiveTab(e.target.id)}} style={buttonStyle}>trade</button>
        <button id="pool" onClick={(e)=>{setActiveTab(e.target.id)}} style={buttonStyle}>pool</button>
        <button id="timeswap" onClick={(e)=>{setActiveTab(e.target.id)}} style={buttonStyle}>timeswap</button>
      </div>
    </>
  );

};