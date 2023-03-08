import React from "react";
import PropTypes from "prop-types";
import { faClockRotateLeft, faBan, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { ellipseAddress } from '../../lib/utilities'
import { useEffect, useState } from "react";
import * as moment from "moment"
// components
import { VerifcaitonRecord } from "../../class/contract"

import TableDropdown from "../Dropdowns/TableDropdown";

export default function CardUserDetails({ color, collection, userRecord, web3ProviderState, userIdentityNFTContract, idVerifedAndIssuedResponse }: any) {
  const [timestamp, setTimestamp] = useState("")

  useEffect(() => {
    console.log("new Date(idVerifedAndIssuedResponse.blockTimestamp)", (new Date(idVerifedAndIssuedResponse.blockTimestamp * 1000)));

    setTimestamp(new Date(idVerifedAndIssuedResponse.blockTimestamp * 1000).toDateString())
  }, [])
  async function RequestForVerification() {

    if (web3ProviderState.provider == null && web3ProviderState.address) {
      console.log("error");

      toast.error("Please Connect to your wallet First");
      return;
    }
    if (web3ProviderState.chainId != 5) {
      toast.error("Please Change your network to Goerli");
      return;
    }
    if (userRecord?.status == 2) {

      if (web3ProviderState.web3Provider) {
        const signer = await web3ProviderState.web3Provider.getSigner();
        // let userIdentityNFTContract = await getUserIdentityNFT(signer)
        // let figurePrintOracleContract = await getFigurePrintOracle(signer)
        // console.log(await figurePrintOracleContract.getUserRecord(await signer.getAddress()));

        try {
          // console.log("_userId", _userId, "_fingurePrint", _fingurePrint);
          if (userIdentityNFTContract) {
            await userIdentityNFTContract.redeem();
          }

          // (await tx).wait();

        } catch (error: any) {
          console.log(error);

          console.log(error.message.substring(0, error.message.indexOf("("))); // "Hello"
        }

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
                  User Verfication Result
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
                  Transaction Signature :
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
                  Request Status :    {userRecord.status}  &nbsp;&nbsp;  {userRecord.status === 0 && <>Pending < FontAwesomeIcon icon={faClockRotateLeft} className="text-lg text-yellow-500 font-bold" /></>}
                  {userRecord.status === 1 && <>Fail <FontAwesomeIcon icon={faBan} className="text-lg text-red-500 font-bold" /></>}
                  {userRecord.status === "2" && <>Successful <FontAwesomeIcon icon={faCheckCircle} className="text-lg  text-green-500  font-bold" /></>}

                </td>
                <td className={
                  "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left    font-bold" +
                  (color === "light"
                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                  {userRecord.status === "2" ? <button className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                    }}>

                    Generate NFT
                  </button> : ""}
                </td>

              </tr>

            </tbody>
          </table>

        </div>
      </div>
    </>
  );
}

CardUserDetails.defaultProps = {
  color: "light",
  userRecord: {},
  web3ProviderState: {},
  userIdentityNFTContract: {},
  voucher: {},
  idVerifedAndIssuedResponse: {},
  collection: ""
};

CardUserDetails.propTypes = {
  color: PropTypes.oneOf(["light", "dark"])
};
