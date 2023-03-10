import React, { useState, useEffect } from "react";
import { faClockRotateLeft, faBan, faCheckCircle, faDownload, faSignature } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ellipseAddress } from '../../lib/utilities'
import { ContractAddress } from "../../config/";
import { Signer } from "./../../class/document"
import { getNftMetadataForExplorer } from "../../lib/alchemy"
// components


export default function ViewDocumentDetails({ showModal, color, setShowModal, documentDetails, web3ProviderState }: any) {

  let [isSigner, setIsSigner] = useState(false);

  useEffect(() => {
    const fetchData = async () => {

      if (web3ProviderState.web3Provider) {
        for (let index = 0; index < documentDetails.singers.length; index++) {
          const element: Signer = documentDetails.singers[index];
          console.log("here ", element);

          let owner = await getNftMetadataForExplorer(ContractAddress.UserIdentityNFT, element.tokenId)
          console.log("owner", owner.owners[0], web3ProviderState.address);

          if (owner.owners[0] == web3ProviderState.address.toLowerCase()) {
            console.log("yup yupyupyupyupyupyup");

            setIsSigner(true)
          }
        }
      }
    }

    if (!isSigner && documentDetails.singers) {

      fetchData()
    }
  }, [])
  return (
    <>

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex w-full overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-full my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Document Details
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div
                  className={
                    "relative flex flex-col min-w-0 break-words w-full mb-6  rounded " +
                    (color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
                  }
                >

                  <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse">
                      <thead>
                        <tr>


                        </tr>
                      </thead>
                      <tbody>
                        <tr>

                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            Name  : {documentDetails.documentName}
                          </td>
                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            Document Id  :                {ellipseAddress(documentDetails.documentId)}

                          </td>

                        </tr>
                        <tr>

                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            Collection : {ellipseAddress(ContractAddress.DocumentSignature)}
                          </td>
                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left  font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            Creator Address :{ellipseAddress(documentDetails.creator)}
                          </td>

                        </tr>

                        <tr>

                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            creation Time :{documentDetails.createdAt}
                          </td>
                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            Owner of Signature :{ellipseAddress(documentDetails.ownerSignature)}
                          </td>

                        </tr>

                        <tr>

                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            Number of Signature :{documentDetails.singers.length}
                          </td>
                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                          </td>

                        </tr>

                        <tr>

                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            Signature Starting Date/Block :{documentDetails.startData} ,{documentDetails.startBlock}
                          </td>
                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs  border-l-0 border-r-0 whitespace-nowrap  text-left font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            Signature Ending Date/Block :{documentDetails.expirationDate} ,{documentDetails.endBlock}

                          </td>

                        </tr>


                        <tr>
                          <th
                            className={
                              "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                              (color === "light"
                                ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                            }
                          >
                            Signer Token
                          </th>
                          <th
                            className={
                              "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                              (color === "light"
                                ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                            }
                          >
                            Signature Status
                          </th>

                        </tr>
                        {documentDetails.singers &&
                          documentDetails.singers.map((item: Signer, i: number) => (
                            <tr key={i}>
                              <td className={
                                "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left   font-bold " +
                                (color === "light"
                                  ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                  : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                                {item.tokenId}
                              </td>
                              <td className={
                                "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left   font-bold " +
                                (color === "light"
                                  ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                  : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                                {item.signature == "" ? <FontAwesomeIcon icon={faClockRotateLeft} className="text-lg text-yellow-500 font-bold" /> :
                                  <FontAwesomeIcon icon={faCheckCircle} className="text-lg  text-green-500  font-bold" />}
                                {item.signature == "" ? "" :
                                  ellipseAddress(item.signature)}
                              </td>
                            </tr>
                          ))
                        }

                        <tr>
                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left   font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>

                            Document Status :  {documentDetails.status == 0 ? <FontAwesomeIcon icon={faClockRotateLeft} className="text-lg text-yellow-500 font-bold" />
                              :
                              <FontAwesomeIcon icon={faCheckCircle} className="text-lg  text-green-500  font-bold" />}
                          </td>
                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left   font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            <button className="py-2.5  my-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-3/5 ease-linear transition-all duration-150"
                              type="button"

                              onClick={() => { }}>
                              <FontAwesomeIcon icon={faDownload} /> &nbsp;&nbsp;Document
                            </button>
                          </td>
                        </tr>

                      </tbody>
                    </table>

                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {isSigner && <button
                    className="py-2.5  my-2 placeholder-blueGray-300 mx-4  text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-1/5 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    <FontAwesomeIcon icon={faSignature} />  Sign Document
                  </button>}
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-blueGray-2-00"></div>
        </>
      ) : null
      }
    </>
  );
}

// ViewDocumentDetails.defaultProps = {
//   color: "light",
//   documentId: "",
//   Name: "",
//   creatorAddress: "",
//   creactionTime: "",
//   transactionSignature: "",
//   collectionAddress: "",
//   signerList: [],
//   setShowModal: function
//   status: "",

// };

// ViewDocumentDetails.propTypes = {
//   props.color: PropTypes.oneOf(["light", "dark"]),
// };
