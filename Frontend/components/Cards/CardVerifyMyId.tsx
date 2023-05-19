import React from "react";
import {
  faFingerprint,
  faSpinner,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from "@ethersproject/contracts";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useApolloClient } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ethers, Signer } from "ethers";
import { toast } from "react-toastify";
import { create } from "ipfs-http-client";
import { useEffect, useCallback, useState } from "react";

import SetPin from "./../Pin/SetPin"

import CardUserDetails from "../../components/Cards/CardUserDetails";
import { UserIdVoucherStruct } from "../../class/typechain-types/contracts/core/UserIdentityNFT";
import { ContractAddress } from "../../config/";
import { StateType, PinState, PinHash } from "../../config"
import { web3ProviderReduxState } from "./../../redux/reduces/web3ProviderRedux";
import { pinStateReducerState, changeState } from "./../../redux/reduces/pinRedux"
import { pinHashReducerState, setHash } from "./../../redux/reduces/pinhashRedux"
import { useAppSelector, useAppDispatch } from "./../../redux/hooks"
import { store } from "./../../redux/store"

import {
  getUserIdentityNFT,
  getFigurePrintOracle,
  getLinkToken,
} from "../../lib/getDeploy";
import { createUserId } from "../../lib/createVoucher";
import { getStringToBytes } from "../../lib/convert";
import { VerifcaitonRecord } from "../../class/contract";
import {
  SIGNING_DOMAIN_NAME,
  SIGNING_DOMAIN_VERSION,
  INFURA_URL,
  INFURA_IPFS_PROJECJECT_ID,
  INFURA_IPFS_PROJECJECT_SECRET,
} from "../../lib/config";

import { IdVerifedAndIssuedResponse, IssueDigitalIdentity } from "./../../class/subgraphResponse";
import { GET_MY_VERIFICATION_REQUEST_DATA, REDEEM_USER_NFT } from "./../../lib/subgrapQueries";
import { post } from "../../utils/";
import { VerificationEntity } from "../../class/contract"
import { log } from "console";

export default function CardVerifyMyId(props: any) {
  // console.log("CardVerifyMyId", props);
  const router = useRouter()
  const { account, active, library } = useWeb3React<Web3Provider>()

  let web3ProviderState: StateType = useAppSelector(web3ProviderReduxState);
  let pinState: PinState = useAppSelector(pinStateReducerState);
  let pinHash: PinHash = useAppSelector(pinHashReducerState);
  const validationSchema = Yup.object().shape({
    // image: Yup.string().required("NFG image is required"),
  });

  const subgraphClient = useApolloClient();
  const [checkPin, setCheckPin] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [pin, setPin] = React.useState("");
  let isRequest = false;
  let isInit = false;

  let [spinnerProcess, setSpinnerProcess] = useState(false);
  let [isSubmitted, setIsSubmitted] = useState(false);

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const [url, setURL] = useState("");
  const [idVerifedAndIssuedResponse, setIdVerifedAndIssuedResponse] =
    useState<IdVerifedAndIssuedResponse>();
  const [issueDigitalIdentity, setIssueDigitalIdentity] =
    useState<IssueDigitalIdentity>();
  const [userIdentityNFTContract, setUserIdentityNFTContract] =
    useState<Contract | undefined>();
  const [figurePrintOracleContract, setFigurePrintOracleContract] =
    useState<Contract | undefined>();
  const [linkToken, setLinkToken] = useState<Contract | undefined>();
  const [userRecord, setUserRecord] = useState<VerifcaitonRecord>();
  const [userLinkBalance, setUserLinkBalance] = useState(0);
  let [uri, setURI] = useState("")
  const [verificationEntity, setVerificationEntity] = useState<VerificationEntity>()
  const dispatch = useAppDispatch();

  const projectIdAndSecret = `${INFURA_IPFS_PROJECJECT_ID}:${INFURA_IPFS_PROJECJECT_SECRET}`;
  const client = create({
    host: INFURA_URL,
    port: 5001,
    protocol: "https",
    headers: {
      authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
        "base64"
      )}`,
    },
  });

  useEffect(() => {

    const fetchData = async () => {
      // if (userRecord) {
      await init()
      let resp = await post("api/get", {
        data: JSON.stringify({
          transactionCode: "002",
          apiName: "getVerificationDetails",
          parameters: {
            userId: userRecord?.userId,
          },
          userId: "user2",
          organization: "org1"
        })
      })
      if (resp.status == 200) {
        console.log("resp.data", resp.data);
        const { data } = await axios.get(`${resp.data.uri}`);
        console.log("data =>", data);
        props.setFirstName(data.firstName);
        props.setLastName(data.lastName);
        props.setAboutMe(data.aboutMe);
        props.setUsername(data.username);
        props.setFingerPrintHash(resp.data.fingerPrint);
        props.setStatus(userRecord?.status)
        props.setTokenId(issueDigitalIdentity?.tokenId)
        props.setQRCodeSvg(data?.image)
        setVerificationEntity(resp.data)
      }
      console.log("resp == >", resp);

    }

    console.log("ahjbdjkasbjcbasjbjksbcjka", verificationEntity, userRecord?.status !== 0, verificationEntity);

    if (userRecord?.status !== 0 && !verificationEntity && !isSubmitted) {
      if (userRecord?.userId !== undefined) {
        setIsSubmitted(true)
      }
      console.log("in =>", verificationEntity, userRecord);

      fetchData()
    }

  }, [userRecord])
  useEffect(() => {

    const fetchData = async () => {
      // if (userRecord) {
      await init()

      // console.log("resp", resp);

    }

    if (!figurePrintOracleContract && web3ProviderState.chainId) {
      // console.log("figurePrintOracleContract", figurePrintOracleContract);
      fetchData();
    }

  }, [web3ProviderState.active])
  const init = useCallback(async function () {
    console.log("init");

    const fetchData = async () => {
      if (!web3ProviderState.active == null && web3ProviderState.account) {
        console.log("error");

        toast.error("Please Connect to your wallet First");
        return;
      }
      if (web3ProviderState.chainId != 5) {
        toast.error("Please Change your network to Goerli");
        return;
      }
      console.log("web3ProviderState.active", web3ProviderState.active);

      if (web3ProviderState.active) {
        let userIdentityNFTContract = await getUserIdentityNFT(web3ProviderState.library);
        let figurePrintOracleContract = await getFigurePrintOracle(web3ProviderState.library);
        let linkToken = await getLinkToken(web3ProviderState.library);
        console.log("linkToken 1=>linkToken", linkToken);

        setLinkToken(linkToken);
        setFigurePrintOracleContract(figurePrintOracleContract);
        setUserIdentityNFTContract(userIdentityNFTContract);


        try {
          const idVerifedAndIssuedResponse = await subgraphClient.query({
            query: GET_MY_VERIFICATION_REQUEST_DATA,
            variables: {
              userAddress: web3ProviderState.account,
            },
          });
          if (idVerifedAndIssuedResponse.data?.idVerifedAndIssueds.length > 0) {
            setIdVerifedAndIssuedResponse(
              idVerifedAndIssuedResponse.data?.idVerifedAndIssueds[0]
            );
            props.setTransactionHash(idVerifedAndIssuedResponse.data?.idVerifedAndIssueds[0].transactionHash)
          }
          const issueDigitalIdentity = await subgraphClient.query({
            query: REDEEM_USER_NFT,
            variables: {
              userAddress: web3ProviderState.account,
            },
          });
          // console.log("issueDigitalIdentity.data?.", issueDigitalIdentity.data);

          if (issueDigitalIdentity.data?.issueDigitalIdentities.length > 0) {
            setIssueDigitalIdentity(
              issueDigitalIdentity.data?.issueDigitalIdentities[0]
            );
          }
        } catch (error) {

        }

        if (figurePrintOracleContract) {
          let userRecord: any = await figurePrintOracleContract.getUserRecord(
            web3ProviderState.account
          );
          console.log("userRecord 2", userRecord);
          let userLinkBalance = await figurePrintOracleContract.getLinkBalance()

          console.log("userLinkBalance 1 => ", userLinkBalance);

          // console.log("userRecord?.status", userRecord["2"].toString(), userRecord["2"].toString() === "0");

          setUserLinkBalance(userLinkBalance);
          setUserRecord({
            userId: userRecord["0"].toString(),
            numberTries: parseInt(userRecord["1"].toString()), //no more the 3 request if case of Rejection
            status: parseInt(userRecord["2"].toString()), //
          });
        }
      }
    };
    console.log("web3ProviderState.chainId", web3ProviderState.chainId);

    if (!figurePrintOracleContract && web3ProviderState.chainId) {
      // console.log("figurePrintOracleContract", figurePrintOracleContract);
      fetchData();
    }
  }, [web3ProviderState]);

  // here we check token is not expired
  const getVerifyToken = useCallback(async function (pin: string,) {
    let openPinModule = false
    // console.log("getVerifyToken", pin);

    // if (pinState.toSavePin) {
    //   dispatch(changeState({ status: !pinState.status, toSavePin: false }))
    // }
    if (web3ProviderState.active) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': "JWT " + localStorage.getItem("token")
      }
      let res = await post(`auth/verify-pin`, {
        address: web3ProviderState.account,
        organization: "org1",
        pin: pin

      }, { headers: headers });
      console.log("res = = = = = = >", res);
      if (res.status == 400) {
        setCheckPin(false)
        setPin("")
        setShowModal(false)
        dispatch(changeState({ status: !pinState.status, toSavePin: true }))
        toast.info("Token Expire")
      } else {
        // submitVerificationRequest(pin)
        // await submitVerificationRequest(pin, props)

        // console.log("asahsjhabdjbasjh");
        dispatch(changeState({ status: true, toSavePin: true }))
        dispatch(setHash({ pinhash: pin }))
        setShowModal(openPinModule)
      }
    }
  }, [web3ProviderState]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("sasa", CryptoJS.MD5("pin").toString());
        await getVerifyToken(CryptoJS.MD5("pin").toString())
      } catch (error: any) {
        console.log(error);

        return;

      }
    }
    // console.log("checkPin && pin.length == 6", checkPin && pin.length == 6, checkPin, pin.length == 6);

    if (checkPin && pin.length == 6 && !isRequest) {
      isRequest = true
      fetchData()
    }
  }, [checkPin])
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("props.username", props.username);
        dispatch(changeState({ status: false, toSavePin: true }))

        await submitVerificationRequest(pinHash.pinhash, props)
      } catch (error: any) {
        console.log(error);

        return;

      }
    }
    console.log("storeDocument =>>>", pinState.toSavePin, pinHash.pinhash, props.username);

    if (store.getState().pinState.status && store.getState().pinHash.pinhash != "" && props.username != "") {
      fetchData()
    }
  }, [pinHash, props])


  const submitVerificationRequest = useCallback(async function (pin: string, props: any) {
    console.log("submitVerificationRequest");
    await init()

    let voucher: Partial<UserIdVoucherStruct> = {};
    //call login for pine code
    if (web3ProviderState.active && web3ProviderState.chainId) {
      // let userIdentityNFTContract = await getUserIdentityNFT(signer)
      // let figurePrintOracleContract = await getFigurePrintOracle(signer)
      // console.log(await figurePrintOracleContract.getUserRecord(await signer.getAddress()));

      const _userId = getStringToBytes(props.username);
      const _fingurePrint = getStringToBytes(props.fingerPrintHash);
      // console.log("_userId", useridRef, "_fingurePrint", _fingurePrint, "props == >", props);

      let imageObject = JSON.stringify({
        image: props.qrCodeSvg,
        firstName: props.firstName,
        lastName: props.lastName,
        aboutMe: props.aboutMe,
        username: props.username,
      });
      // console.log("props.qrCodeSvg", props.qrCodeSvg);

      let uri: string = "";
      try {
        const added = await client.add(imageObject);
        // ipfs = `${INFURA_GATEWAY_URL}${added.path}`;
        uri = `https://ai-nft.infura-ipfs.io/ipfs/${added.path}`;
        // console.log('uri', uri);

        setURL(uri);
      } catch (error) {
        toast.error("something is wrong with IPFS");
        return "";
      }
      let signer = web3ProviderState.library?.getSigner()
      if (signer) {
        try {
          voucher = (await createUserId(
            signer,
            _userId,
            uri,
            _fingurePrint,
            SIGNING_DOMAIN_NAME,
            SIGNING_DOMAIN_VERSION,
            web3ProviderState.chainId.toString(),
            ContractAddress.UserIdentityNFT
          )) as UserIdVoucherStruct;

          // console.log("url", url);

          // console.log("voucher", voucher);
        } catch (error: any) {
          // console.log(error.message.substring(0, error.message.indexOf("("))); // "Hello"
          toast.error(error.message.substring(0, error.message.indexOf("(")));
          return
        }

        try {
          let linkToken = await getLinkToken(web3ProviderState.library);
          let figurePrintOracleContract = await getFigurePrintOracle(web3ProviderState.library);
          let userIdentityNFTContract = await getUserIdentityNFT(web3ProviderState.library);
          let userLinkBalance = 0;
          if (figurePrintOracleContract)
            userLinkBalance = await figurePrintOracleContract.getLinkBalance()

          let isLinkTransfer = false;
          console.log("userLinkBalance 2 =>", userLinkBalance, linkToken);

          if (userLinkBalance < ethers.parseEther("0.1")) {
            if (linkToken) {
              // await linkToken.transfer(ContractAddress.UserIdentityNFT)

              const data = getStringToBytes("")

              let tx = await linkToken.transferAndCall(
                ContractAddress.FigurePrintOracle,
                ethers.parseEther("0.1"),
                data
              )

              // const fromMe = linkToken.filters.Transfer(web3ProviderState.account, null)
              // await linkToken.on(fromMe, (from, to, amount, event) => {
              //   console.log('Transfer|sent', { from, to, amount, event })
              // })
              // console.log("recepite 1", typeof tx, tx);,

              let recepite = await tx.wait()
              console.log("recepite", tx);
              if (figurePrintOracleContract) {
                let balance = await figurePrintOracleContract.getLinkBalance()
                console.log("balance ==>", balance);
              }
              isLinkTransfer = true;
            }
          } else {
            isLinkTransfer = true;
          }
          console.log("_userId", _userId, "_fingurePrint", _fingurePrint, "isLinkTransfer", isLinkTransfer, userIdentityNFTContract);
          if (userIdentityNFTContract && isLinkTransfer) {
            let tx = await userIdentityNFTContract.verifyFingerPrint(
              _userId,
              _fingurePrint
            );
            let recepite = await tx.wait()
            await post("api/addQueue", {
              data: JSON.stringify({
                transactionCode: "002",
                apiName: "createVerificationRecord",
                parameters: {
                  userId: voucher.userId,
                  creator: web3ProviderState.account,
                  uri: voucher.uri,
                  fingerPrint: voucher.fingerPrint,
                  status: "1",
                  signature: voucher.signature
                },
                pinHash: pin,
                userId: web3ProviderState.account,
                organization: "org1"
              })
            });
            router.reload()
          }

        } catch (error: any) {
          console.log(error);

          // console.log(error.message.substring(0, error.message.indexOf("("))); // "Hello"
          toast.error(error.message.substring(0, error.message.indexOf("(")));

          return;
        }
      } else {
        toast.error("Signer Account Not Found")
      }
    }
  }, [web3ProviderState]);

  async function RequestForVerification() {
    console.log("RequestForVerification");

    if (!web3ProviderState.active == null && web3ProviderState.account) {
      // console.log("error");

      toast.error("Please Connect to your wallet First");
      return;
    }
    if (web3ProviderState.chainId != 5) {
      toast.error("Please Change your network to Goerli");
      return;
    }

    if (
      userRecord?.status === 0 ||
      (userRecord?.status === 3 && userRecord?.numberTries < 3)
    ) {
      // console.log("setPurpose");
      // console.log("props1 == >", props);
      console.log("userRecord 1", userRecord);

      setSpinnerProcess(true)
      if (localStorage.getItem("token")) {
        setShowModal(true)
      } else {
        // console.log("pinState.status", pinState.status);
        dispatch(changeState({ status: !pinState.status, toSavePin: true }))
      }

    }
  }
  const myRef: React.LegacyRef<HTMLInputElement> = React.createRef();
  const isApply = false;
  return (
    <>{userRecord &&
      <div className="relative border-2 flex flex-col min-w-0 break-words w-full mt-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        {userRecord?.status !== 0 && (
          <CardUserDetails
            web3ProviderState={web3ProviderState}
            userIdentityNFTContract={userIdentityNFTContract}
            userRecord={userRecord}
            idVerifedAndIssuedResponse={idVerifedAndIssuedResponse}
            collection={ContractAddress.UserIdentityNFT}
            issueDigitalIdentity={issueDigitalIdentity}
            verificationEntity={verificationEntity}
          />
        )}

        {userRecord?.status === 0 && (
          <>
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  My account
                </h6>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form
                id="create-choose-type-single"
                onSubmit={handleSubmit(RequestForVerification)}
              >
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  User Information
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        User Id
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        ref={props.useridRef}

                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setUsername(e.currentTarget.value);
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setEmail(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setFirstName(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setLastName(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-9/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Finger Print Hash
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setFingerPrintHash(e.currentTarget.value);

                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-3/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      ></label>

                      <button
                        className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        type="button"
                      >
                        <FontAwesomeIcon icon={faFingerprint} />{" "}
                      </button>
                    </div>
                  </div>
                  <div className="w-full lg:w-9/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Card Image Both Side
                      </label>
                      <input
                        type="text"
                        ref={myRef}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        readOnly
                      />
                      <input
                        type="file"
                        ref={myRef}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        style={{ display: "none" }}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-3/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      ></label>

                      <button
                        className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          myRef.current?.click();
                          console.log(myRef.current?.files);
                        }}
                      >
                        <FontAwesomeIcon icon={faIdCard} />{" "}
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Contact Information
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setAddress(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setCity(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setCountry(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue=""
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          props.setPostalCode(e.currentTarget.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <hr className="mt-6 border-b-1 border-blueGray-300" />

                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  About Me
                </h6>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        About me
                      </label>
                      <textarea
                        // type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        rows={4}
                        defaultValue=""
                        onChange={(e) => {
                          props.setAboutMe(e.currentTarget.value);
                        }}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center flex-wrap">
                  <div className="w-3/12  lg:w-12/12 px-4">
                    <div className="relative  center mb-3">
                      <button
                        className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        type="submit"
                      >
                        {spinnerProcess && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />} &nbsp;&nbsp;

                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
        <SetPin setShowModal={setShowModal} showModal={showModal} buttonLable={"Verify Pin"} color="light" setPin={setPin} pin={pin} setCheckPin={setCheckPin} />
      </div>}
    </>
  );
}
