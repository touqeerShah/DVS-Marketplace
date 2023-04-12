import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { StateType, PinState, PinHash } from "../../config"
import SetPin from "./../Pin/SetPin"

import { faClockRotateLeft, faCheckCircle, faDownload, faSignature, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ellipseAddress } from '../../lib/utilities'
import { ContractAddress } from "../../config/";
import { Signer } from "./../../class/document"
import { getNftMetadataForExplorer, getLatestBlockNumber } from "../../lib/alchemy"
import { secondsConverter } from "../../lib/convert"
import { UriData } from "./../../class/document"
import { createDocument, processDocumentWithSignature } from "../../lib/createVoucher"
import { post } from "./../../utils"
import { IDocumentSignature } from "../../class/typechain-types/contracts/core/DocumentSignature"
import { getStringToBytes } from "../../lib/convert"
import { useAppSelector, useAppDispatch } from "./../../redux/hooks"
import { pinStateReducerState, changeState } from "./../../redux/reduces/pinRedux"
import { pinHashReducerState, setHash } from "./../../redux/reduces/pinhashRedux"
import { store } from "./../../redux/store"
import {
  DS_SIGNING_DOMAIN_NAME,
  DS_SIGNING_DOMAIN_VERSION,

} from "../../lib/config"
import {
  getDocumentSignature,
} from "../../lib/getDeploy";
import { log } from "console";


export default function ViewDocumentDetails({ showModal, color, setShowModal, documentDetails, web3ProviderState, setMyDocuments, documentRequestType, tokenId }: any) {
  let pinState: PinState = useAppSelector(pinStateReducerState);
  let pinHash: PinHash = useAppSelector(pinHashReducerState);
  const dispatch = useAppDispatch();

  let [isSigner, setIsSigner] = useState(false);
  let [timeRemaining, setTimeRemaining] = useState("0s");
  let [documentStatus, setDocumentStatus] = useState(-1);

  let [signatureDone, setSignatureDone] = useState(false);
  let [isDocumentOwner, setIsDocumentOwner] = useState(false);
  let [spinnerProcess, setSpinnerProcess] = useState(false);
  const [checkPin, setCheckPin] = React.useState(false);
  const [showPinModal, setPinShowModal] = React.useState(false);
  const [submitFrom, setSubmitFrom] = React.useState("");

  const [pin, setPin] = React.useState("");
  let isRequest = false;
  let [uriData, setUriData] = useState<UriData>();

  const getStatusSignDocument = async () => {
    const signer = await web3ProviderState.web3Provider.getSigner();
    let documentContract: ethers.Contract = await getDocumentSignature(signer);
    // console.log(Number(await documentContract.getStatusSignDocument(0, documentDetails.startBlock, documentDetails.endBlock)));
    let DocumentStatus: number = Number(await documentContract.getStatusSignDocument(0, documentDetails.startBlock, documentDetails.endBlock))
    console.log(documentDetails.documentName, "DocumentStatus", DocumentStatus, documentDetails.startBlock, documentDetails.endBlock);

    return DocumentStatus;
  }
  // here we check token is not expired
  const getVerifyToken = useCallback(async function (pin: string,) {
    let openPinModule = false
    console.log("getVerifyToken", pin);

    // if (pinState.toSavePin) {
    //   dispatch(changeState({ status: !pinState.status, toSavePin: false }))
    // }
    if (web3ProviderState.web3Provider) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': "JWT " + localStorage.getItem("token")
      }
      let res = await post(`auth/verify-pin`, {
        address: web3ProviderState.address,
        organization: "org1",
        pin: pin

      }, { headers: headers });
      console.log("res = = = = = = >", res);
      if (res.status == 400) {
        setCheckPin(false)
        setPin("")
        setPinShowModal(false)
        dispatch(changeState({ status: !pinState.status, toSavePin: true }))
        toast.info("Token Expire")
      } else {
        setPinShowModal(openPinModule)
        if (submitFrom == "submitProcessDocument") {
          await submitProcessDocument(pin)
        } else if (submitFrom == "submitSignDocument") {
          await submitSignDocument(pin)
        }
      }
    }
  }, [web3ProviderState]);



  // call when user provide Pin for verifications
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
        if (submitFrom == "submitProcessDocument") {
          await submitProcessDocument(pin)
        } else {
          await submitSignDocument(pin)
        }
      } catch (error: any) {
        console.log(error);

        return;

      }
    }
    console.log("storeDocument", pinState.toSavePin, pinHash.pinhash);

    if (store.getState().pinState.status && store.getState().pinHash.pinhash != "") {
      fetchData()
    }
  }, [pinHash])

  const submitProcessDocument = useCallback(async function (pin: string,) {

    const signer = await web3ProviderState.web3Provider.getSigner();
    let documentContract: ethers.Contract = await getDocumentSignature(signer);
    console.log(await signer.getAddress());

    // console.log(Number(await documentContract.getStatusSignDocument(0, documentDetails.startBlock, documentDetails.endBlock)));
    let DocumentStatus: number = Number(await documentContract.getStatusSignDocument(0, documentDetails.startBlock, documentDetails.endBlock))
    if (DocumentStatus == 5) {
      try {
        let singers: IDocumentSignature.PartyStruct[] = []
        for (let index = 0; index < documentDetails.singers.length; index++) {
          const element: Signer = documentDetails.singers[index];
          let owner = await getNftMetadataForExplorer(ContractAddress.UserIdentityNFT, element.tokenId)
          console.log("owner", owner.owners[0], web3ProviderState.address);
          let _signer = await documentContract.verifification(web3ProviderState.address, documentDetails.documentId, documentDetails.uri, element.signature)
          console.log("_signer", _signer);

          if (owner.owners[0] != _signer.toLowerCase()) {
            toast.error("Document is Compromise Invalid User Signature , " + element.tokenId)
            return;
          }
          singers.push({
            tokenId: element.tokenId,
            signatures: element.signature,
            status: 0
          })
        }
        let documentDetialsWithSigatureStruct: IDocumentSignature.DocumentDetialsWithSigatureStruct = {
          creator: web3ProviderState.address,
          name: getStringToBytes(documentDetails.documentName),
          description: getStringToBytes(documentDetails.purpose),
          parties: singers,
          status: 0,
          signatureStart: documentDetails.startBlock,
          signatureEnd: documentDetails.endBlock,
          documentId: documentDetails.documentId,
          uri: documentDetails.uri
        }

        await documentContract.processDocumentWithSignature(documentDetialsWithSigatureStruct);
        setSpinnerProcess(false)
        setMyDocuments([])
        await post("addQueue", {
          data: JSON.stringify({
            transactionCode: "002",
            apiName: "api/updateStatusDocument",
            parameters: {
              documentId: documentDetails.documentId.toString(),
              status: "4"
            },
            pinHash: pin,
            userId: web3ProviderState.address,
            organization: "org1"
          })
        });
        toast.success("Successfully Process Document " + ellipseAddress(documentDetails.documentId))

      } catch (error: any) {
        setSpinnerProcess(false)
        console.log("error", error);

        toast.error(error.message.substring(0, error.message.indexOf("(")))
        return;


      }
    } else {
      toast.info("Please Wait document in status change to Queue")
      return;
    }

  }, []);
  const submitSignDocument = useCallback(async function (pin: string,) {
    let voucher: string = "";

    if (tokenId) {

      const signer = await web3ProviderState.web3Provider.getSigner();
      if (documentDetails) {
        try {
          voucher = (await createDocument(
            signer,
            web3ProviderState.address,
            documentDetails.uri,
            documentDetails.documentId,
            DS_SIGNING_DOMAIN_NAME,
            DS_SIGNING_DOMAIN_VERSION,
            web3ProviderState.chainId.toString(),
            ContractAddress.DocumentSignature
          )) as string;

        } catch (error: any) {
          console.log(error.message.substring(0, error.message.indexOf("("))); // "Hello"
          toast.error(error.message.substring(0, error.message.indexOf("(")))
          return;
        }

        try {

          await post("api/addQueue", {
            data: JSON.stringify({
              transactionCode: "002",
              apiName: "addSignatureDocument",
              parameters: {
                documentId: documentDetails.documentId.toString(),
                signature: voucher,
                signer: tokenId
              },
              pinHash: pin,
              userId: web3ProviderState.address,
              organization: "org1"
            })
          });
          setShowModal(false)
          setMyDocuments([])
          toast.success("Successfully Sign Document " + ellipseAddress(documentDetails.documentId))

        } catch (error) {
          console.log("error", error);
          toast.error("Hyperledger Node Have Issues")
          return;

        }
      }
    } else {
      toast.error("No User Identity Record found")
      return
    }
  }, []);
  const ProcessDocument = async () => {
    setSpinnerProcess(true)
    setSubmitFrom("submitProcessDocument")
    if (web3ProviderState.provider == null && web3ProviderState.address) {
      console.log("error");

      toast.error("Please Connect to your wallet First");
      return;
    }
    if (web3ProviderState.chainId != 11155111) {
      toast.error("Please Change your network to Goerli");
      return;
    }
    setSpinnerProcess(true)
    if (localStorage.getItem("token")) {
      setShowModal(true)
    } else {
      console.log("pinState.status", pinState.status);
      dispatch(changeState({ status: !pinState.status, toSavePin: true }))
    }

  }
  const SignDocument = async () => {
    setSubmitFrom("submitSignDocument")
    setSpinnerProcess(true)

    if (web3ProviderState.provider == null && web3ProviderState.address) {
      console.log("error");

      toast.error("Please Connect to your wallet First");
      return;
    }
    if (web3ProviderState.chainId != 11155111) {
      toast.error("Please Change your network to Goerli");
      return;
    }
    if (localStorage.getItem("token")) {
      setShowModal(true)
    } else {
      console.log("pinState.status", pinState.status);
      dispatch(changeState({ status: !pinState.status, toSavePin: true }))
    }


  }

  useEffect(() => {
    const fetchData = async () => {
      if (documentDetails && showModal) {
        try {
          const { data } = await axios.get(`${documentDetails.uri}`);
          console.log("data", data);

          setUriData(data)
        } catch (error) {

        }
      }
      if (web3ProviderState.web3Provider) {
        setDocumentStatus(await getStatusSignDocument())
        setIsDocumentOwner(web3ProviderState.address.toLowerCase() == documentDetails.creator.toLowerCase())
        let blockDifference: number = documentDetails.endBlock - await getLatestBlockNumber();
        console.log(documentDetails.documentName, "blockDifference", blockDifference);

        if (blockDifference > 0) {
          let result = secondsConverter(blockDifference)
          setTimeRemaining(result)
        }
        let count = 0
        for (let index = 0; index < documentDetails.singers.length; index++) {
          const element: Signer = documentDetails.singers[index];
          console.log("here ", element);

          let owner = await getNftMetadataForExplorer(ContractAddress.UserIdentityNFT, element.tokenId)
          console.log("owner", owner.owners[0], web3ProviderState.address);
          if (element.signature != "") {
            count++;
          }
          if (owner.owners[0] == web3ProviderState.address.toLowerCase()) {

            setIsSigner(true)
          }
        }
        if (documentDetails.singers.length == count) {
          setSignatureDone(true)
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
            <div className="relative w-full my-6 mx-auto max-w-5xl">
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
                            Time Remaining to Sign :  {timeRemaining}
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
                                &nbsp;&nbsp;&nbsp;&nbsp;
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

                            Document Status :  {documentStatus == 0 ? <FontAwesomeIcon icon={faClockRotateLeft} className="text-lg text-yellow-500 font-bold" />
                              :
                              <FontAwesomeIcon icon={faCheckCircle} className="text-lg  text-green-500  font-bold" />}{documentStatus}
                          </td>
                          <td className={
                            "px-6 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap  text-left   font-bold " +
                            (color === "light"
                              ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                              : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")}>
                            {uriData && <a download={uriData.fileName.toString()} href={uriData.file}>

                              <button className="py-2.5  my-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-3/5 ease-linear transition-all duration-150"
                                type="button"

                                onClick={() => { }}>

                                <FontAwesomeIcon icon={faDownload} /> &nbsp;&nbsp;Document
                              </button></a>}
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
                  {documentRequestType == "ForSignature" && isSigner && !signatureDone && <button
                    className="py-2.5  my-2 placeholder-blueGray-300 mx-4  text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-1/5 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => SignDocument()}
                  >
                    {spinnerProcess && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                    Sign Document
                  </button>}
                  {documentRequestType == "Owner" && isDocumentOwner && signatureDone && <button
                    className="py-2.5  my-2 placeholder-blueGray-300 mx-4  text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-1/5 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => ProcessDocument()}
                  >
                    {spinnerProcess && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}

                    &nbsp;&nbsp; Process Document
                  </button>}
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-blueGray-2-00"></div>
          <SetPin setShowModal={setPinShowModal} showModal={showPinModal} buttonLable={"Verify Pin"} color="light" setPin={setPin} pin={pin} setCheckPin={setCheckPin} />

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
