"use client"
import React from "react";
import { useRouter } from 'next/router'
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoJS from 'crypto-js';

import Link from "next/link";
// components
import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from "@web3-react/core";
import { connectorsByName, Metamask } from "./../../lib/connectors";

import Web3Modal from 'web3modal'
import { toast } from "react-toastify";


import { ellipseAddress } from '../../lib/utilities'

import { StateType, PinState, PinHash } from "../../config"
import { useAppSelector, useAppDispatch } from "./../../redux/hooks"
import { web3ProviderReduxState, connectState, disconnectState, changeAddress, initialState } from "./../../redux/reduces/web3ProviderRedux"
import { pinStateReducerState, getState } from "./../../redux/reduces/pinRedux"
import { setHash } from "./../../redux/reduces/pinhashRedux"
import { store } from "./../../redux/store"

import { post } from "./../../utils"

import IndexDropdown from "../Dropdowns/IndexDropdown";
import NotificationMenu from "../Notification/NotificationMenu"
import ConnectWallet from "../Wallet/ConnectWallet"
import SetPin from "./../Pin/SetPin"


export default function Navbar(props: any) {
  const router = useRouter()
  const [getTokenCall, setGetTokenCall] = React.useState(false);
  let isRequest = false;

  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [pin, setPin] = React.useState("");
  const [checkPin, setCheckPin] = React.useState(false);
  const [isUserExist, setIsUserExist] = React.useState(false);
  const [walletConnect, setWalletConnect] = React.useState(false);

  const { library, active, chainId, account, activate, deactivate } = useWeb3React();

  const [notificationMenuOpen, setNotificationMenuOpen] = React.useState(true);
  let web3Modal: Web3Modal | null;
  let chainData: any;
  let web3ProviderState: StateType = useAppSelector(web3ProviderReduxState);
  let pinState: PinState = useAppSelector(pinStateReducerState);

  // const [web3ProviderState, setCollapseShow] = useState("hidden");

  const dispatch = useAppDispatch();

  const getToken = useCallback(async function (pin: string, isUserExist: boolean) {
    console.log("pin", pin, pinState, store.getState().pinState, active);


    let res = await post("auth/get-message", { address: account, chainId: chainId })
    if (active) {
      console.log("res===>", res);

      // const signer = await web3ProviderState.web3Provider.getSigner();
      if (res.message) {
        try {
          const signature = await library.provider.request({
            method: "personal_sign",
            params: [res.message, account]
          });
          // var signature = await signer.signMessage(res.message)
          setCheckPin(false)
          setPin("")

          res = await post(`auth/verify-signature`, {
            nonce: res.nonce,
            issuedAt: res.issuedAt,
            statement: res.statement,
            address: account,
            chainId: res.chainId,
            isUserExist: isUserExist,
            pin: pin,
            uri: res.uri,
            organization: "org1",
            signature: signature
          });
          console.log("token", res.data);
          localStorage.setItem('token', res.data);
          if (store.getState().pinState.toSavePin) {
            // dispatch(changeState({ status: !pinState.status, toSavePin: false }))
            dispatch(setHash({ pinhash: pin }))
          }
        } catch (error) {
          setCheckPin(false)
          setPin("")
          setShowModal(false)
        }


      }
    }
  }, [active]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("sasa", CryptoJS.MD5("pin").toString());
        // console.log("isUserExist", isUserExist);

        await getToken(CryptoJS.MD5("pin").toString(), isUserExist)

      } catch (error: any) {
        console.log(error);

        return;

      }
    }
    // console.log("checkPin && pin.length == 6", checkPin && pin.length == 6, checkPin, pin.length == 6);

    if (checkPin && pin.length == 6) {
      fetchData()
    }
  }, [checkPin])
  useEffect(() => {
    const fetchData = async () => {
      try {

        let res = await post("auth/checkUserExist", { "organization": "org1", "address": account })
        if (res.status == 400) {
          toast.error(res.message);
        } else {
          let openPinModule = false
          console.log("checkUserExist", res.data);

          setIsUserExist(res.data)
          if (localStorage.getItem("token")) {
            const headers = {
              'Content-Type': 'application/json',
              'Authorization': "JWT " + localStorage.getItem("token")
            }
            res = await post(`auth/verify-token`, {
              address: account,
              organization: "org1",

            }, { headers: headers });
            if (res.status != 200) {
              localStorage.removeItem("token")
              openPinModule = true
            }
            console.log("auth/verify-toke", res);
          } else {
            localStorage.removeItem("token")
            dispatch(setHash({ pinhash: "" }))

            openPinModule = true
          }
          setShowModal(openPinModule)
        }
      } catch (error: any) {
        console.log("error", error);

        toast.error(error.message.substring(0, error.message.indexOf("(")))
        return;

      }
    }

    if (active && !isRequest) {
      isRequest = true;
      fetchData()
    }
  }, [getTokenCall, pinState.status, active])



  useEffect(() => {
    if (library && library.provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch(changeAddress(accounts[0]))
        setGetTokenCall(false)
        localStorage.removeItem('token');
        router.reload()
        // dispatch({
        //   type: 'SET_ADDRESS',
        //   address: accounts[0],
        // })
      }




      library.provider.on('accountsChanged', handleAccountsChanged)


      // Subscription Cleanup

    }
  }, [library])



  // useEffect(() => {
  //   if (account && changeAddress(account)) {
  //     console.log("change accoungt");

  //     setGetTokenCall(false)
  //     localStorage.removeItem('token');
  //     // router.reload()
  //   }
  //   // localStorage.removeItem('token');
  //   // setGetTokenCall(false)
  // }, [account])
  useEffect(() => {
    console.log("heheheheh====>", web3ProviderState);
    if (active && !web3ProviderState.active) {
      let _state: StateType = {
        library,
        account,
        chainId,
        active
      }
      dispatch(connectState(_state))
    }
  }, [active])
  // useEffect(() => {
  //   window.location.reload()


  const handleWalletConnect = (currentConnector: any) => {
    console.log("currentConnector.connector", currentConnector.connector);

    activate(currentConnector.connector, (error) => {
      if (error) {
        console.log("error", error);
      }
    });
    if (currentConnector.name === "Metamask")
      localStorage.setItem("walletConnect", "true");
    setWalletConnect(false)
    setGetTokenCall(true)

  };
  const handleWalletDisconnect = () => {
    deactivate();
    // setShowDisconnectWallet(false);
    setGetTokenCall(false)
    localStorage.removeItem('token');
    // setGetTokenCall(false)
    localStorage.removeItem("walletConnect");
    router.push("/")
  };
  useEffect(() => {
    /*
    Reconnect to metamask wallet after refresh if aready connected
    */
    const walletConnectStatus: string =
      localStorage.getItem("walletConnect") || "";

    try {
      if (walletConnectStatus === "true")
        Metamask.isAuthorized().then((isAuthorized: boolean) => {
          if (isAuthorized) {
            activate(Metamask, undefined, true).catch(() => { });
          } else {
            deactivate();
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    /*
    Reconnect to metamask wallet after refresh if aready connected
    */
    const walletConnectStatus: string =
      localStorage.getItem("walletConnect") || "";
    console.log("here");

    try {
      if (walletConnectStatus === "true")

        Metamask.isAuthorized().then((isAuthorized: boolean) => {
          // console.log("here =>", library.getSigner())÷

          if (isAuthorized) {
            activate(Metamask, undefined, true).catch(() => { });
          } else {
            deactivate();
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, []); //eslint-disable-line
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
                {active ? (
                  <button className="bg-blueGray-700 text-white active:bg-blueGray-600 border-2 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="button" onClick={handleWalletDisconnect}>
                    Disconnect
                  </button>
                ) : (
                  <button className="bg-blueGray-700 text-white active:bg-blueGray-600 border-2 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                    type="button" onClick={() => {
                      console.log('setWalletConnect', walletConnect);
                      setWalletConnect(true)
                    }}>
                    Connect
                  </button>
                )}
                <>  {account && (


                  <button className=" text-white active:bg-blueGray-600 text-xs border-2 font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150" type="button" >
                    {/* Network:
            {props?.chainData?.name}  */}
                    {ellipseAddress(account)}

                  </button>
                )}</>

              </li>
            </ul>
          </div>
        </div>
        <SetPin setShowModal={setShowModal} showModal={showModal} buttonLable={pinState.toSavePin || isUserExist ? "Enter Pin " : "Create Pin"} color="light" setPin={setPin} pin={pin} setCheckPin={setCheckPin} />
        <ConnectWallet walletConnect={walletConnect} color="light" setWalletConnect={setWalletConnect} handleWalletConnect={handleWalletConnect} />
      </nav>
    </>
  );
}
