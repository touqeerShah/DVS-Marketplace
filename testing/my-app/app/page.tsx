"use client"

import Image from 'next/image'
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { ethers } from "ethers";

import React from "react";
import { LinkToken, FigurePrintOracle, UserIdentityNFT } from "./ContractABI"
import { ContractAddress } from "./contractAddress"
export default function Home() {

  const [address, setAddress] = React.useState("0x");
  const handleWalletConnect = async () => {
    console.log("call connect");

    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];
      setAddress(userAddress)
      const linkContract = new web3.eth.Contract(LinkToken as AbiItem[], ContractAddress.LinkToken, { from: address });
      const figurePrintOracleContract = new web3.eth.Contract(FigurePrintOracle as AbiItem[], ContractAddress.FigurePrintOracle, { from: address });
      const userIdentityNFTContract = new web3.eth.Contract(UserIdentityNFT as AbiItem[], ContractAddress.UserIdentityNFT, { from: address });

      const data = await figurePrintOracleContract.methods.getLinkBalance().call();
      console.log("getLinkBalance", data);
      let bytesData: string = web3.utils.padRight(web3.utils.fromAscii("7d80a6386ef543a3abb52817f6707e327d80a6386ef543a3abb52817f6707e32"), 34)
      console.log("bytesData", bytesData);
      // const _bytes = ethers.encodeBytes32String("7d80a6386ef543a3abb52817f6707e32");
      // console.log('name: ', _bytes)
      // let tx = await linkContract.methods.transferAndCall(
      //   ContractAddress.FigurePrintOracle,
      //   ethers.parseEther("0.1"),
      //   bytesData
      // ).send()
      // // let recepite = await tx.wait()
      // console.log("recepite", tx);

      let tx = await figurePrintOracleContract.methods.verifyFingerPrint(
        address,
        bytesData,
        bytesData
      ).send()
      console.log("recepite", tx);


    } catch (error: any) {
      if (error.message === 'User denied account authorization') {
        // handle the case where the user denied the connection request
        console.log("error.message", error.message);

      } else if (error.message === 'MetaMask is not enabled') {
        // handle the case where MetaMask is not available
        console.log("error.message", error.message);

      } else {
        // handle other errors
        console.log("error.message", error.message);

      }
    }

  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {address}
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>


      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">


      </div>
      <button className="bg-blueGray-700 text-white active:bg-blueGray-600 border-2 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
        type="button" onClick={() => {
          console.log('setWalletConnect');
          handleWalletConnect()
        }}>
        Connect
      </button>
    </main>
  )
}
