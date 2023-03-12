"use client"
import React from "react";
import { useRouter } from 'next/router'
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
// components
import { useCallback, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { Web3Provider } from "@ethersproject/providers"
import { toast } from "react-toastify";


import { getChainData } from '../../lib/utilities'
import { web3ModalSetup } from "../../lib/Web3ModalSetup"
import { ellipseAddress } from '../../lib/utilities'

import { StateType } from "../../config"
import { useAppSelector, useAppDispatch } from "./../../redux/hooks"
import { web3ProviderReduxState, connectState, disconnectState, changeAddress, changeChain, initialState } from "./../../redux/reduces/web3ProviderRedux"
import { post } from "./../../utils"

import IndexDropdown from "../Dropdowns/IndexDropdown";
import NotificationMenu from "../Notification/NotificationMenu"
import SetPin from "./../Pin/SetPin"


export default function Navbar(props: any) {
  const router = useRouter()
  const [getTokenCall, setGetTokenCall] = React.useState(false);
  let isRequest = false;

  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [pin, setPin] = React.useState("");

  const [notificationMenuOpen, setNotificationMenuOpen] = React.useState(true);
  let web3Modal: Web3Modal | null;
  let chainData: any;
  let web3ProviderState: StateType = useAppSelector(web3ProviderReduxState);
  // const [web3ProviderState, setCollapseShow] = useState("hidden");

  const dispatch = useAppDispatch();

  const connect = useCallback(async function () {
    console.log("start");

    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal?.connect()

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new Web3Provider(provider)

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()
    console.log("network.chainId", network.chainId);
    chainData = getChainData(network.chainId)
    console.log("end");
    // dispatch(changeAddress(address))
    // console.log("->>", web3Provider);
    let _state: StateType = {
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
      chainData
    }
    dispatch(connectState(_state))
    setGetTokenCall(true)
    // await get("auth/checkUserExist", { "organization": "org1" })
    console.log("web3ProviderState", web3ProviderState);


  }, [])

  const disconnect = useCallback(
    async function () {
      console.log("disconnect");
      // dispatch(disconnectState())
      localStorage.clear();

      console.log(await web3Modal?.clearCachedProvider())
      console.log("disconnect", await web3ProviderState.web3Provider?.detectNetwork());

      if (web3ProviderState.provider.disconnect && typeof web3ProviderState.provider.disconnect === 'function') {
        console.log("disconnect");

        await web3ProviderState.provider.disconnect()
      }
      dispatch(disconnectState())
      // web3ProviderState = initialState

    },
    [web3ProviderState.provider]
  )
  const getToken = useCallback(async function () {
    let res = await post("auth/get-message", { address: web3ProviderState.address, chainId: web3ProviderState.chainId })
    if (web3ProviderState.web3Provider) {
      const signer = await web3ProviderState.web3Provider.getSigner();
      if (res.message) {
        var signature = await signer.signMessage(res.message)
        res = await post(`auth/verify-signature`, {
          nonce: res.nonce,
          issuedAt: res.issuedAt,
          statement: res.statement,
          address: web3ProviderState.address,
          chainId: res.chainId,
          uri: res.uri,
          signature: signature
        });
        console.log("token", res.data);

      }
    }
  }, []);
  useEffect(() => {

    web3Modal = web3ModalSetup();
  }, [])
  // // // Auto connect to the cached provider
  useEffect(() => {
    const fetchData = async () => {
      try {


        let res = await post("auth/checkUserExist", { "organization": "org1", "address": web3ProviderState.address })
        if (res.status == 400) {
          toast.error(res.message);
        } else {
          if (!res.data) {
            setShowModal(true)
          } else {
            await getToken()
          }

        }
      } catch (error: any) {
        toast.error(error.message.substring(0, error.message.indexOf("(")))
        return;

      }
    }
    console.log("token- ", web3ProviderState.address, getTokenCall);

    if (web3ProviderState.address && !isRequest) {

      isRequest = true;
      fetchData()
    }
  }, [getTokenCall])


  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      connect()
    }
  }, [connect])
  // // A `provider` should come with EIP-1193 events. We'll listen for those events
  // // here so that when a user switches accounts or networks, we can update the
  // // local React state with that new information.
  useEffect(() => {
    if (web3ProviderState.provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch(changeAddress(accounts[0]))
        // dispatch({
        //   type: 'SET_ADDRESS',
        //   address: accounts[0],
        // })
      }

      //     // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload()
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      web3ProviderState.provider.on('accountsChanged', handleAccountsChanged)
      web3ProviderState.provider.on('chainChanged', handleChainChanged)
      web3ProviderState.provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (web3ProviderState.provider.removeListener) {
          web3ProviderState.provider.removeListener('accountsChanged', handleAccountsChanged)
          web3ProviderState.provider.removeListener('chainChanged', handleChainChanged)
          web3ProviderState.provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [web3ProviderState.provider, disconnect])

  return (
    <>
      {/* absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4 */}
      <nav className={(router.pathname.indexOf("user") == -1) ? "top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-black shadow" : "absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4"}>
        <NotificationMenu
          notificationMenuOpen={notificationMenuOpen}
          setNotificationMenuOpen={setNotificationMenuOpen}
        />

        <div className="container px-10 mx-auto flex flex-wrap items-center justify-between">
          {(router.pathname.indexOf("user") == -1) && <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            {/* <Link href="/"> */}
            {/* <div className="container flex flex-wrap items-center justify-between mx-auto"> */}
            <a className=" flex items-center"
              href="#pablo">
              <img src="/logo-white.png" className="-mt-10 md:-mt-12 ml-3 md:ml-0 h-24 w-30 md:h-40 md:w-40 " alt="Flowbite Logo" />
            </a>
            {/* </div> */}
            {/* </Link> */}
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              {/* <i className="fas fa-bars"></i> */}

              <FontAwesomeIcon icon={faBars} />{" "}

            </button>
          </div>}
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none mr-auto">

            </ul>
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {(router.pathname.indexOf("user") == -1) && <li className="flex items-center">
                <IndexDropdown />
              </li>}
              {(router.pathname.indexOf("user") == -1) &&
                <li className="flex items-center">

                  <div onClick={() => { setNotificationMenuOpen(false) }} className="hover:text-blueGray-500 text-blueGray-700 px-1 py-1  lg:py-2 flex items-center text-xs uppercase font-bold relative">

                    <FontAwesomeIcon className="text-blueGray-400 far text-lg leading-lg mr-2" icon={faBell} />{" "}
                    <span className="lg:hidden inline-block ml-2">Noftification</span>

                    <div className="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2  text-center	rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-2.5 text-xs bg-red-600 rounded-full z-10" style={{ height: 10, width: 10 }}>       &nbsp;       </div>
                  </div>
                </li>}

              <li className="flex items-center">
                {/* <button
                  className="bg-blueGray-700 text-white active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                  type="button"
                >
                  <FontAwesomeIcon icon={faArrowAltCircleDown} />{" "}

                  <i className="fas fa-arrow-alt-circle-down"></i> Download
                </button> */}
                {web3ProviderState?.web3Provider ? (
                  <button className="bg-blueGray-700 text-white active:bg-blueGray-600 border-2 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="button" onClick={disconnect}>
                    Disconnect
                  </button>
                ) : (
                  <button className="bg-blueGray-700 text-white active:bg-blueGray-600 border-2 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="button" onClick={connect}>
                    Connect
                  </button>
                )}
                <>  {web3ProviderState?.address && (


                  <button className=" text-white active:bg-blueGray-600 text-xs border-2 font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150" type="button" >
                    {/* Network:
            {props?.chainData?.name}  */}
                    {ellipseAddress(web3ProviderState.address)}

                  </button>
                )}</>

              </li>
            </ul>
          </div>
        </div>
        <SetPin setShowModal={setShowModal} showModal={showModal} buttonLable={"Create Pin"} color="light" setPin={setPin} pin={pin} />
      </nav>
    </>
  );
}
