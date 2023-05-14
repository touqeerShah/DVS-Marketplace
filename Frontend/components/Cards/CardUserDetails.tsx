import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useRouter } from 'next/router'

import { faClockRotateLeft, faBan, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { ellipseAddress } from '../../lib/utilities'
import { useEffect, useState } from "react";
import { post } from "../../utils"
import { UserIdVoucherStruct } from "../../class/typechain-types/contracts/core/UserIdentityNFT";
import { pinHashReducerState, setHash } from "./../../redux/reduces/pinhashRedux"
import { store } from "./../../redux/store"
import CryptoJS from 'crypto-js';

// components
import SetPin from "./../Pin/SetPin"

import { pinStateReducerState, changeState } from "./../../redux/reduces/pinRedux"
import { useAppSelector, useAppDispatch } from "./../../redux/hooks"
import { StateType, PinState, PinHash } from "../../config"


export default function CardUserDetails({ color, collection, userRecord, web3ProviderState, userIdentityNFTContract, idVerifedAndIssuedResponse, issueDigitalIdentity, verificationEntity }: any) {
  const router = useRouter()

  let pinState: PinState = useAppSelector(pinStateReducerState);
  let pinHash: PinHash = useAppSelector(pinHashReducerState);

  const [timestamp, setTimestamp] = useState("")
  const [verificationTimestamp, setVerificationTimestamp] = useState("")

  // const [verificationEntity, setVerificationEntity] = useState<VerificationEntity>()
  // pin verficiation 
  const [checkPin, setCheckPin] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [pin, setPin] = React.useState("");
  let [spinnerProcess, setSpinnerProcess] = useState(false);
  const dispatch = useAppDispatch();
  let isRequest = false;

  useEffect(() => {

    if (JSON.stringify(issueDigitalIdentity) != "{}") {
      console.log("ssss", issueDigitalIdentity);
      setVerificationTimestamp(new Date(issueDigitalIdentity.blockTimestamp * 1000).toDateString())

    }
    if (JSON.stringify(idVerifedAndIssuedResponse) != "{}")
      setTimestamp(new Date(idVerifedAndIssuedResponse.blockTimestamp * 1000).toDateString())
  }, [])
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
    console.log("checkPin && pin.length == 6", checkPin && pin.length == 6, checkPin, pin.length == 6);

    if (checkPin && pin.length == 6 && !isRequest) {
      isRequest = true
      fetchData()
    }
  }, [checkPin])
  useEffect(() => {
    const fetchData = async () => {
      try {
        await submitCreateUserNFTRequest(pinHash.pinhash, userRecord)
      } catch (error: any) {
        console.log(error);

        return;

      }
    }
    console.log("storeDocument =>>>", store.getState().pinState.status, pinHash.pinhash);

    if (store.getState().pinState.status && store.getState().pinHash.pinhash != "" && userRecord.userId != "") {
      dispatch(changeState({ status: false, toSavePin: true }))
      fetchData()
    }
  }, [pinHash])

  async function submitCreateUserNFTRequest(pin: string, userRecord: any) {
    console.log("submitCreateUserNFTRequest");

    if (!web3ProviderState.active == null && web3ProviderState.account) {
      console.log("error");

      toast.error("Please Connect to your wallet First");
      return;
    }
    if (web3ProviderState.chainId != 5) {
      toast.error("Please Change your network to Goerli");
      return;
    }
    if (userRecord?.status == 2) {

      if (web3ProviderState.active) {
        // let userIdentityNFTContract = await getUserIdentityNFT(signer)
        // let figurePrintOracleContract = await getFigurePrintOracle(signer)
        // console.log(await figurePrintOracleContract.getUserRecord(await signer.getAddress()));

        try {
          // console.log("_userId", _userId, "_fingurePrint", _fingurePrint);
          console.log("userIdentityNFTContract", userIdentityNFTContract);

          if (userIdentityNFTContract && verificationEntity) {
            let voucher: UserIdVoucherStruct = { uri: verificationEntity.uri, userId: userRecord.userId, fingerPrint: verificationEntity.fingerPrint, signature: verificationEntity.signature }
            console.log("voucher", voucher);

            let tx = await userIdentityNFTContract.redeem(voucher);
            let recepite = await tx.wait()
            console.log("recepite", tx);

            await post("api/addQueue", {
              data: JSON.stringify({
                transactionCode: "002",
                apiName: "updateStatus",
                parameters: {
                  userId: userRecord.userId,
                  status: "2"
                },
                pinHash: pin,
                userId: web3ProviderState.account,
                organization: "org1"
              })
            });
          }
          router.reload()

          // (await tx).wait();

        } catch (error: any) {
          console.log("this one", error);

          console.log(error.message.substring(0, error.message.indexOf("("))); // "Hello"
        }

      }
    }


  }
  async function createUserNFT() {
    console.log("RequestForVerification", userRecord?.status);

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
      userRecord?.status == 2
    ) {
      console.log("setPurpose");
      console.log("props1 == >");

      setSpinnerProcess(true)
      if (localStorage.getItem("token")) {
        setShowModal(true)
      } else {
        // console.log("pinState.status", pinState.status);
        dispatch(changeState({ status: !pinState.status, toSavePin: true }))
      }

    }
  }
  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6  rounded " +
          (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Blockchain Details
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  User Verification Request Result
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  {"         "}&nbsp;
                </th>

              </tr>
            </thead>
            <tbody>
              <tr>

                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Block  number :{(idVerifedAndIssuedResponse.blockNumber)}
                </td>
                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Block Timestamp  : {(timestamp)}
                </td>

              </tr>

              <tr>

                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Transaction Signature :  {ellipseAddress(verificationEntity?.signature)}
                </td>
                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Transaction hash : {ellipseAddress(idVerifedAndIssuedResponse.transactionHash)}
                </td>

              </tr>
              <tr>

                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Collection : {ellipseAddress(collection)}
                </td>
                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left  font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Uri :
                  {ellipseAddress(verificationEntity?.uri)}
                </td>

              </tr>

              <tr>

                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Request Id : {ellipseAddress(idVerifedAndIssuedResponse.requestId)}
                </td>
                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Number of Tries : {userRecord.numberTries}
                </td>

              </tr>

              <tr>

                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left   font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Request Status :    {userRecord.status}  &nbsp;&nbsp;  {userRecord.status === 1 && <>Pending < FontAwesomeIcon icon={faClockRotateLeft} className="text-lg text-yellow-500 font-bold" /></>}
                  {userRecord.status === 3 && <>Fail <FontAwesomeIcon icon={faBan} className="text-lg text-red-500 font-bold" /></>}
                  {userRecord.status === 2 && <>Successful &nbsp;&nbsp; <FontAwesomeIcon icon={faCheckCircle} className="text-lg  text-green-500  font-bold" /></>}

                </td>
                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left    font-bold" +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  {(userRecord.status === 2 && !issueDigitalIdentity.tokenId) ? <button className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      createUserNFT()
                    }}>

                    Generate NFT
                  </button> : ""}
                </td>

              </tr>

            </tbody>
          </table>

          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  User Verification Result
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  {"         "}&nbsp;
                </th>

              </tr>
            </thead>
            <tbody>
              <tr>

                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Block  number : &nbsp;{(issueDigitalIdentity.blockNumber)}
                </td>
                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Block Timestamp  : {(verificationTimestamp)}
                </td>

              </tr>

              <tr>

                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Token ID  : {issueDigitalIdentity?.tokenId}
                </td>
                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  Transaction hash : {ellipseAddress(issueDigitalIdentity.transactionHash)}
                </td>

              </tr>




            </tbody>
          </table>

        </div>
      </div>
      <SetPin setShowModal={setShowModal} showModal={showModal} buttonLable={"Verify Pin"} color="light" setPin={setPin} pin={pin} setCheckPin={setCheckPin} />

    </>
  );
}

CardUserDetails.defaultProps = {
  color: "light",
  userRecord: {},
  web3ProviderState: {},
  userIdentityNFTContract: {},
  idVerifedAndIssuedResponse: {},
  collection: "",
  issueDigitalIdentity: {},
  verificationEntity: {}
};

CardUserDetails.propTypes = {
  color: PropTypes.oneOf(["light", "dark"])
};
