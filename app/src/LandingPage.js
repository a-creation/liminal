
import './App.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import axios from "axios";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { ConnectPhantomView } from "./components/ConnectPhantom.jsx";
import './LandingPage.css'
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import tokenMints from './utils/tokens'
import { web3, Provider, setProvider } from '@project-serum/anchor';
import { ConnectionContext, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import LoadingScreen from './Loading';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';

const tokenList = ['serum', 'raydium', 'saber', 'orca', 'solend', 'marinade']

function LandingPage() {

  const [tickerList, setTickers] = useState([])
  const [SDIAmount, setSDI] = useState('')
  const [priceList, setPrices] = useState([])
  const [tokenPrice, setTokenPrice] = useState(0)
  const [historyList, setHistoryList] = useState([])
  const [amountInSet, setAmounts] = useState([6.75,3.8,3.65,2,1.15,0.45])
  const [chartOptions, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();

  useEffect(() => {
    setTimeout(() => setLoading(false), 6000)

    // for(const token of tokenList){
    //   await getPrice(token)
    // }

    // let res = await axios.get('https://api.coingecko.com/api/v3/coins/' + "serum" + '?tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false')
    // console.log('res', res.data)

    async function getPrice(){

      let newTickerList = []
      let newPrices = []
      let newHistory = []
      let datenow = parseInt(Date.now() / 1000)
      let monthago = datenow - 2630000
      for(const token of tokenList){
        // let url = 'https://api.coingecko.com/api/v3/coins/' + token + '?tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false'
        // fetch(url).then(response => response.json()).then(response => {
        // console.log('here', response)
        // console.log('datenow', datenow, monthago)
        let res = await axios.get('https://api.coingecko.com/api/v3/coins/' + token + '?tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false')
        let history = await axios.get('https://api.coingecko.com/api/v3/coins/' + token + '/market_chart?vs_currency=usd&days=30')
        // console.log('history', history.data.prices)
        // newTickerList = tickerList.slice()
        // console.log('res.data', res.data)
        newTickerList.push(res.data.symbol)
        // newPrices = priceList.slice()
        newPrices.push(res.data.market_data.current_price.usd.toFixed(2))
        newHistory.push(history.data.prices)
        // console.log('new history', newHistory)
      }
      // console.log('new history', newHistory)
      setTickers(newTickerList)
      setPrices(newPrices)
      setHistoryList(newHistory)
      const thisPrice = (amountInSet[0] * newPrices[0]) + (amountInSet[1] * newPrices[1]) + (amountInSet[2] * newPrices[2]) + (amountInSet[3] * newPrices[3]) + (amountInSet[4] * newPrices[4]) + (amountInSet[5] * newPrices[5])
      setTokenPrice(thisPrice)
      getSDIBalance()
    }
    getPrice()

  }, [])

  useEffect(()=>{
    console.log('here')
    getSDIBalance()
  },[wallet])

  const getChartOptions = () => {
    const calculateAssetHistoryPrice = () => {
      if(historyList.length == 0){
        return
      } else {
        // console.log('historyList', historyList)
        // for(let i=0; i < historyList)


        let dataList = []
        for(let i=0; i < historyList[0].length; i++){
          let datapoint = 0
          let time = historyList[0][i]
          for(let j=0; j < historyList.length; j++){
            // console.log('historylist[j][i]', historyList[j][i])
            if(historyList[j][i]){
            //   console.log('WHAT?', historyList[j][i][1])
            //   console.log('YO???', amountInSet[j])
            //   console.log('here', parseFloat(historyList[j][i][1])*amountInSet[j])
              datapoint += parseFloat(parseFloat(historyList[j][i][1])*amountInSet[j])
            }
          }
        //   console.log('[time, datapoint]',[time, datapoint])
          dataList.push([time[0], datapoint])
        }

        let ret = dataList.slice(0, -1)
        return ret
      }
    }

    return {
      title: {
        text: "Index Token Price"
      },
      series: [
        {
          data: calculateAssetHistoryPrice(),
          color: "#2ad7ba",
          name: "Price"
        }
      ]
    }
  }

  const renderTable = () => {
    if(priceList.length == tokenList.length){
      return (
        tokenList.map((ele, idx) => {
          return <tr key={idx}>
          <th>{ele[0].toUpperCase() + ele.slice(1)}</th>
          <th>{tickerList[idx].toUpperCase()}</th>
          <th>{priceList[idx].toFixed(2)}</th>
          <th>{amountInSet[idx] + " " + tickerList[idx].toUpperCase()}</th>
          <th>{(parseFloat(priceList[idx])*amountInSet[idx]).toFixed(2)}</th>
        </tr>
        })
      )
    } else {
      return (
        <div>Loading</div>
      )
    }
  }

  const renderIndex = () => {

    if(priceList.length == tokenList.length){
      let sum = 0
      for(let i=0; i<priceList.length; i++){
        sum += parseFloat((parseFloat(priceList[i])*amountInSet[i]).toFixed(2))
      }


      return <tr>
        <th>Solana Defi Index</th>
        <th>SDI</th>
        <th>X</th>
        <th>X</th>
        <th>{sum.toFixed(2)}</th>

      </tr>
    } else {
      return (
        <div>Loading</div>
      )
    }
  }


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
  }

  const dashboardData = {
    liminalText: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6249047feb3325afc1883df0/img/liminalprotocol-1@2x.png",
    liminalCircle11: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle2-1@2x.png",
    solanaDefiIndex1: "Solana DeFi Index",
    marketcapval: "$105,295,348.43",
    marketcaplbl: "Market Cap",
    tokensownedval: "3",
    tokensownedlbl: "SDI Owned",
    mybalanceval: "$103.29",
    changeval: "+4.32%",
    mint: "Mint",
    redeem: "Redeem",
    buy: "Buy",
    sell: "Sell",
    token: "Token",
    amountPerSet: "Amount per set",
    surname: "Price",
    totalPricePerSet: "Total Price per set",
    ticker: "Ticker",
    liminalCircle12: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/62490669bcd5aa5cbf85c294/img/liminal-circle2-1@2x.png",
    // liminalCircle12: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6248c5e048afce78b014832f/img/liminal-circle-1-1@2x.png",
    solanaDefiIndex2: "Solana DeFi Index",
    xxxXx: "$XXX.XX",
    liminalCircle13: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6248c99afc21b296361f38c4/img/liminal-circle-1-2@2x.png",
    serum: "Serum",
    number1: "6",
    price1: "$3.37",
    price2: "$20.22",
    srm: "SRM",
    liminalCircle14: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6248c99afc21b296361f38c4/img/liminal-circle-1-3@2x.png",
    raydium: "Raydium",
    number2: "6",
    price3: "$3.37",
    price4: "$20.22",
    name: "RAY",
    liminalCircle15: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6248c99afc21b296361f38c4/img/liminal-circle-1-4@2x.png",
    saber: "Saber",
    number3: "6",
    price5: "$3.37",
    price6: "$20.22",
    sbr: "SBR",
    liminalCircle16: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6248c99afc21b296361f38c4/img/liminal-circle-1-5@2x.png",
    orca1: "Orca",
    number4: "6",
    price7: "$3.37",
    price8: "$20.22",
    orca2: "ORCA",
    liminalCircle17: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6248c99afc21b296361f38c4/img/liminal-circle-1-6@2x.png",
    solend: "Solend",
    number5: "6",
    price9: "$3.37",
    price10: "$20.22",
    slnd: "SLND",
    liminalCircle18: "https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6248c99afc21b296361f38c4/img/liminal-circle-1-7@2x.png",
    marinade: "Marinade",
    number6: "6",
    price11: "$3.37",
    price12: "$20.22",
    mnde: "MNDE",
    underlyingtokenslbl: "Underlying Tokens",
    about: "About",
    theSolanaDefiInde: <>The Solana DeFi Index is a capitalization-weighted index that tracks the performance of decentralized financial assets across the market.<br /><br /><br />The Solana DeFi Index is a digital asset index designed to track tokens’ performance within the Decentralized Finance industry. The index is weighted based on the value of each token’s circulating supply. The Solana DeFi Index aims to track projects in Decentralized Finance that have significant usage and show a commitment to ongoing maintenance and development.</>,
  };

  const {
    liminalText,
    liminalCircle11,
    solanaDefiIndex1,
    marketcapval,
    marketcaplbl,
    tokensownedval,
    tokensownedlbl,
    mybalanceval,
    changeval,
    mint,
    redeem,
    buy,
    sell,
    token,
    amountPerSet,
    surname,
    totalPricePerSet,
    ticker,
    liminalCircle12,
    solanaDefiIndex2,
    xxxXx,
    liminalCircle13,
    serum,
    number1,
    price1,
    price2,
    srm,
    liminalCircle14,
    raydium,
    number2,
    price3,
    price4,
    name,
    liminalCircle15,
    saber,
    number3,
    price5,
    price6,
    sbr,
    liminalCircle16,
    orca1,
    number4,
    price7,
    price8,
    orca2,
    liminalCircle17,
    solend,
    number5,
    price9,
    price10,
    slnd,
    liminalCircle18,
    marinade,
    number6,
    price11,
    price12,
    mnde,
    underlyingtokenslbl,
    about,
    theSolanaDefiInde,
  } = dashboardData;


  // return (
  //   <>
  //   {loading === false ? (
  //     <div>hi</div>
  //     ) : (
  //       <LoadingScreen />
  //     )}
  //     </>
  // );

  return (
    
    <div style={{backgroundColor:"#f8f8f8"}}>
      {/* <div><button onClick={mintTokens}>MINT TOKEN</button></div> */}
      <div className="container-center-horizontal">
      {(priceList.length === 0) ? <LoadingScreen/>:
        <div className="dashboard screen">
          <div className="flex-row" style={{marginBottom:'30px'}}>
            <div className="flex-col">
              <img className="liminal-text" src={liminalText} />
              <div className="sdi-label">
                <img className="liminal-circle-1-1" src={liminalCircle11} />
                <div className="solana-de-fi-index">{solanaDefiIndex1}</div>
              </div>
              <div className="my-portfolio-stn">
                <img
                  className="my-portfolio-lbl"
                  src="https://anima-uploads.s3.amazonaws.com/projects/61d5fb6479d2de012a81c2e8/releases/6248c41ceb3325afc1883d6e/img/myportfoliolbl@2x.svg"
                />
                <div className="overlap-group1">
                  <div className="market-cap-stn">
                    <div className="market-cap-val inter-medium-black-18-5px">{marketcapval}</div>
                    <div className="market-cap-lbl inter-medium-mountain-mist-15-4px">{marketcaplbl}</div>
                  </div>
                  <div className="sdi-stn">
                    <div className="tokens-owned-val inter-medium-black-18-5px">{SDIAmount}</div>
                    <div className="tokens-owned-lbl inter-medium-mountain-mist-15-4px">{tokensownedlbl}</div>
                  </div>
                  <h1 className="my-balance-val">{"$" + (tokenPrice * SDIAmount).toFixed(2)}</h1>
                  <div className="change-val">{changeval}</div>
                </div>
              </div>
            </div>
            <div className="overlap-group2">
              <div className="mint inter-semi-bold-white-22-4px">
                <Link id="buy-link" to="/buy">Mint</Link>
              </div>
              {/* <div className="mint inter-semi-bold-white-22-4px">{mint}</div> */}
            </div>
            <div className="overlap-group3">
              <div className="redeem inter-semi-bold-white-22-4px">
                <Link id="sell-link" to="/sell">Redeem</Link>
              </div>
            </div>
            <div className="overlap-group-container">
            <div className="overlap-group">
                <WalletMultiButton />
              </div>
              <div className="overlap-group4">
                <div className="buy inter-semi-bold-white-22-4px">
                  <a href="https://raydium.io/swap/" target="_blank">Buy</a>
                </div>
              </div>
            </div>
            <div className="overlap-group-container">
              <div className="overlap-group">
                <WalletDisconnectButton />
              </div>
              <div className="overlap-group5">
                <div className="sell inter-semi-bold-white-22-4px">
                  <a href="https://raydium.io/swap/" target="_blank">Sell</a>
                </div>
              </div>
            </div>
          </div>
            <div style={{display:'flex', backgroundColor:'white', padding:'30px', margin:'20px', borderRadius:'15px', boxShadow: '0px 0px 4px #00000026', width:'1300px', height:'600px'}}>
              <HighchartsReact 
                containerProps={{ style: { height: "100%", width: '100%' }}}
                highcharts={Highcharts} 
                constructorType={'stockChart'} 
                options={getChartOptions()}
              />
            </div>
          <div className="overlap-group7">
            <div className="rectangle-8"></div>
            <div className="token inter-semi-bold-mountain-mist-22-4px">{token}</div>
            <div className="rectangle-9"></div>
            <div className="amount-per-set inter-semi-bold-mountain-mist-22-4px">{amountPerSet}</div>
            <div className="surname inter-semi-bold-mountain-mist-22-4px">{surname}</div>
            <div className="total-price-per-set inter-semi-bold-mountain-mist-22-4px">{totalPricePerSet}</div>
            <div className="xxxxx inter-semi-bold-black-19-2px">{"$" + tokenPrice.toFixed(2)}</div>
            <div className="ticker inter-semi-bold-mountain-mist-22-4px">{ticker}</div>
            <div className="sdi-label-1">
              <img className="liminal-circle-1" src={liminalCircle12} />
              <div className="solana-de-fi-index-1 inter-semi-bold-black-19-2px">{solanaDefiIndex2}</div>
            </div>
            <div className="serum-row inter-normal-black-19-2px">
              <div className="serum-label">
                <img className="liminal-circle-1" src={liminalCircle13} />
                <div className="serum inter-semi-bold-black-19-2px">{serum}</div>
              </div>
              <div className="number">{amountInSet[0]}</div>
              <div className="price">{"$" + priceList[0]}</div>
              <div className="price-1">{"$" + (amountInSet[0] * priceList[0]).toFixed(2)}</div>
              <div className="srm">{srm}</div>
            </div>
            <div className="raydium-row inter-normal-black-19-2px">
              <div className="raydium-label">
                <img className="liminal-circle-1" src={liminalCircle14} />
                <div className="raydium inter-semi-bold-black-19-2px">{raydium}</div>
              </div>
              <div className="number-1">{amountInSet[1]}</div>
              <div className="price">{"$" + priceList[1]}</div>
              <div className="price-1">{"$" + (amountInSet[1] * priceList[1]).toFixed(2)}</div>
              <div className="name">{name}</div>
            </div>
            <div className="saber-row inter-normal-black-19-2px">
              <div className="saber-label">
                <img className="liminal-circle-1" src={liminalCircle15} />
                <div className="saber inter-semi-bold-black-19-2px">{saber}</div>
              </div>
              <div className="number-2">{amountInSet[2]}</div>
              <div className="price">{"$" + priceList[2]}</div>
              <div className="price-1">{"$" + (amountInSet[2] * priceList[2]).toFixed(2)}</div>
              <div className="sbr">{sbr}</div>
            </div>
            <div className="saber-row-1 inter-normal-black-19-2px">
              <div className="saber-label-1">
                <img className="liminal-circle-1" src={liminalCircle16} />
                <div className="orca inter-semi-bold-black-19-2px">{orca1}</div>
              </div>
              <div className="number-3">{amountInSet[3]}</div>
              <div className="price">{"$" + priceList[3]}</div>
              <div className="price-1">{"$" + (amountInSet[3] * priceList[3]).toFixed(2)}</div>
              <div className="orca-1">{orca2}</div>
            </div>
            <div className="solend-row inter-normal-black-19-2px">
              <div className="solend-label">
                <img className="liminal-circle-1" src={liminalCircle17} />
                <div className="solend inter-semi-bold-black-19-2px">{solend}</div>
              </div>
              <div className="number-4">{amountInSet[4]}</div>
              <div className="price">{"$" + priceList[4]}</div>
              <div className="price-1">{"$" + (amountInSet[4] * priceList[4]).toFixed(2)}</div>
              <div className="slnd">{slnd}</div>
            </div>
            <div className="solend-row-1 inter-normal-black-19-2px">
              <div className="solend-label-1">
                <img className="liminal-circle-1" src={liminalCircle18} />
                <div className="marinade inter-semi-bold-black-19-2px">{marinade}</div>
              </div>
              <div className="number-5">{amountInSet[5]}</div>
              <div className="price">{"$" + priceList[5]}</div>
              <div className="price-1">{"$" + (amountInSet[5] * priceList[5]).toFixed(2)}</div>
              <div className="mnde">{mnde}</div>
            </div>
            <div className="overlap-group6">
              <div className="underlying-tokens-lbl">{underlyingtokenslbl}</div>
            </div>
          </div>
          <div className="about">{about}</div>
          <div className="the-solana-de-fi-inde">{theSolanaDefiInde}</div>
        </div>}
      </div>
    </div>
        // <div className="App">
    //   <header className="App-header">
    //     {/* <MainView></MainView> */}
    //     Liminal Protocol

    //     <br></br>
    //     Solana Defi Pulse

    //     {historyList.length !== 0 && <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={getChartOptions()} />}
    //     <table>
    //       <tr>
    //         <th>Token</th>
    //         <th>Ticker</th>
    //         <th>Price</th>
    //         <th>Amount in Set</th>
    //         <th>Total Price Per Set</th>
    //       </tr>
    //       {renderIndex()}
    //       {renderTable()}
    //     </table>
    //     <button id="buy-button">
    //         <Link id="buy-button-link" to="/buy">Buy</Link>
    //     </button>
    //     <button id="get-started-button">
    //         <Link id="sell-button-link" to="/sell">Sell</Link>
    //     </button>
    //     <br />
    //     <button>Mint</button>
    //     <button>Redeem</button>
    //   </header>
    // </div>
  );
}

export default LandingPage;
