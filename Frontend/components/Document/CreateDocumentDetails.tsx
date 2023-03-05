import React, { useState, useEffect } from "react";
import { faFingerprint, faFile, faPlusCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddParameter from "../TextField/AddSingner"
import { TypeDocumentSignerFields } from "../../class/document"

// components

import { UserIdVoucherStruct } from "../../class/typechain-types/contracts/core/UserIdentityNFT";

import { ethers, Signer } from "ethers";
import { toast } from "react-toastify";


import { ContractAddress } from "../../config/"

// components

import { StateType } from "../../config"
import { useAppSelector } from "./../../redux/hooks"
import { web3ProviderReduxState } from "./../../redux/reduces/web3ProviderRedux"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { create } from "ipfs-http-client";

import { getDocumentSignature, getUserIdentityNFT } from "../../lib/getDeploy";
import { createDocument } from "../../lib/createVoucher"
import { getStringToBytes } from "../../lib/convert";

import {
  DS_SIGNING_DOMAIN_NAME,
  DS_SIGNING_DOMAIN_VERSION,
  AVERAGE_BLOCK_MINT_TIME,
  INFURA_URL,
  INFURA_IPFS_PROJECJECT_ID,
  INFURA_IPFS_PROJECJECT_SECRET,
  ETHERSCANAPIKEY
} from "../../lib/config"


export default function CreateDocumentDetails(props: any) {
  // console.log("props =>", props);
  let web3ProviderState: StateType = useAppSelector(web3ProviderReduxState);
  const validationSchema = Yup.object().shape({
    // image: Yup.string().required("NFG image is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const [url, setURL] = useState("")
  const [documentId, setDocumentId] = useState(0)
  const [documentName, setDocumentName] = useState("")
  const [purpose, setPurpose] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  var buffer = new ArrayBuffer(0);

  let [fileBuffer, setFileBuffer] = useState(buffer);
  let [fileName, setFileName] = useState("");



  const [documentSignatureContract, setDocumentSignatureContract] = useState<ethers.Contract>()
  const [userIdentityNFTContract, setUserIdentityNFTContract] = useState<ethers.Contract>()



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

      if (web3ProviderState.web3Provider) {
        const signer = await web3ProviderState.web3Provider.getSigner();
        let documentSignatureContract = await getDocumentSignature(signer)
        setDocumentSignatureContract(documentSignatureContract)
        let userIdentityNFTContract = await getUserIdentityNFT(signer)
        setUserIdentityNFTContract(userIdentityNFTContract)
      }
    }

    if (!documentSignatureContract) {
      console.log('figurePrintOracleContract', documentSignatureContract);

      fetchData()
    }
  }, [])

  async function signDocument() {

    if (web3ProviderState.provider == null && web3ProviderState.address) {
      console.log("error");

      toast.error("Please Connect to your wallet First");
      return;
    }
    if (web3ProviderState.chainId != 5) {
      toast.error("Please Change your network to Goerli");
      return;
    }
    let voucher: string;

    if (web3ProviderState.web3Provider && web3ProviderState.address && documentSignatureContract) {
      var currentDate = new Date("2023-03-04");
      var startDateSeconds = (new Date(startDate).getTime() - currentDate.getTime()) / 1000;
      var endDateSeconds = (new Date(endDate).getTime() - currentDate.getTime()) / 1000;
      var startBlock = startDateSeconds / AVERAGE_BLOCK_MINT_TIME
      var endBlock = endDateSeconds / AVERAGE_BLOCK_MINT_TIME

      const signer = await web3ProviderState.web3Provider.getSigner();
      let parties: TypeDocumentSignerFields[] = props.documentSignerFieldsState as TypeDocumentSignerFields[]
      console.log("parties", parties);
      let partiesId: number[] = []

      let getPartiesId = async (party: TypeDocumentSignerFields) => {
        console.log(party);

        if (party.userId != "" && userIdentityNFTContract) {
          let tokenId: number = parseInt(party.userId)
          console.log("tokenId", tokenId);

          //check from sub graph party token exist or not
          partiesId.push(tokenId)
        }
      }
      parties.filter((party: TypeDocumentSignerFields) => { getPartiesId(party) })

      console.log("partiesId", partiesId);

      if (userIdentityNFTContract && 0 == await userIdentityNFTContract.balanceOf(web3ProviderState.address)) {

        toast.error("Verify  Your Identity First");
        return;
      }


      const type = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length)
      console.log("type", type);

      const base64data = Buffer.from(fileBuffer).toString('base64')
      const file: string = `data:${type};base64,` + base64data
      let documentId: number = 0;
      // console.log(file);
      try {
        const _documentName = getStringToBytes(documentName)
        const _purpose = getStringToBytes(purpose)

        documentId = await documentSignatureContract.getDocumentId(web3ProviderState.address, _documentName, _purpose, partiesId)
        console.log("documentId", typeof documentId);

        setDocumentId(documentId)
      } catch (error: any) {
        console.log("getDocumentId error ", error);
        toast.error(error.message.substring(0, error.message.indexOf("(")))
        return;
      }

      let imageObject = JSON.stringify({
        documentId: documentId.toString(),
        documentName,
        purpose,
        file: file,
        fileName,
        startBlock,
        endBlock,
        creator: web3ProviderState.address,
        signer: partiesId,
      })
      let uri: string = ""
      try {
        const added = await client.add(imageObject);

        uri = `https://ipfs.io/ipfs/${added.path}`
        console.log("uri", uri);

        setURL(uri)
      } catch (error) {
        toast.error("something is wrong with IPFS")
        return "";
      }
      try {

        voucher = (await createDocument(
          signer,
          web3ProviderState.address,
          uri,
          documentId,
          DS_SIGNING_DOMAIN_NAME,
          DS_SIGNING_DOMAIN_VERSION,
          web3ProviderState.chainId.toString(),
          ContractAddress.UserIdentityNFT
        )) as string;

        console.log("url", url);

        console.log("voucher", voucher);
      } catch (error: any) {
        console.log(error.message.substring(0, error.message.indexOf("("))); // "Hello"
        toast.error(error.message.substring(0, error.message.indexOf("(")))
      }




    }


  }
  const myRef: React.LegacyRef<HTMLInputElement> = React.createRef();
  return (
    <>
      <div className="relative border-2 flex flex-col min-w-0 break-words w-full mt-6 shadow-lg rounded-lg bg-blueGray-100 border-0">

        <><div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">Create Document</h6>

          </div>
        </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <form
              onSubmit={handleSubmit(signDocument)}

            >
              <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                Dcoument Details
              </h6>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Document Id
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={documentId}
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        // setDocumentId(e.currentTarget.value)
                      }}
                      readOnly
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Document Name
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        setDocumentName(e.currentTarget.value)
                      }}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-full px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Purpose
                    </label>

                    <textarea className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      id="w3review" name="w3review" rows={4} cols={50}
                      onChange={(e: any) => {
                        setDocumentName(e.currentTarget.value)
                      }}
                    ></textarea>
                  </div>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
                {props.documentSignerFieldsState && <> <h6 className="text-blueGray-400 w-4/5	 text-sm mt-3 mb-6 font-bold uppercase">
                  Signer
                </h6>
                  <div className="w-1/5	 py-2.5">
                    <div className="relative  center ">
                      <button className="border-0 py-2.5  my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        type="button"

                        onClick={() => props.addParameterFields()}>
                        <FontAwesomeIcon icon={faPlusCircle} />{" "}
                      </button>
                    </div>
                  </div></>
                }      {props.documentSignerFieldsState && props.documentSignerFieldsState.map((fields: TypeDocumentSignerFields, index: number) => (

                  <AddParameter key={index} documentSignerFieldsState={props.documentSignerFieldsState}
                    setDocumentSignerFieldsState={props.setDocumentSignerFieldsState} id={fields.id} />))}
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Signature Start
                    </label>
                    <input
                      type="date"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        setStartDate(e.currentTarget.value)
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
                      Signature End
                    </label>
                    <input
                      type="date"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                      onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        setEndDate(e.currentTarget.value)
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
                      Sign Document
                    </label>
                    <input
                      type="text"
                      ref={myRef}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue={fileName}
                      readOnly
                    />
                    {/* <a download="Book1.xlsx" href={fileName}>Download</a> */}

                    <input
                      type="file"
                      ref={myRef}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      defaultValue=""
                      style={{ display: "none" }}
                      onChange={async () => {
                        // console.log(await myRef.current?.files?.[0].arrayBuffer());
                        console.log("myRef.current?.files?.[0].", myRef.current?.files?.[0]);

                        const _fileBuffer: ArrayBuffer | undefined = await myRef.current?.files?.[0].arrayBuffer()
                        console.log("1");

                        let file = myRef.current?.files?.[0]
                        if (_fileBuffer) {
                          console.log("2");
                          setFileBuffer(_fileBuffer)
                        }

                        if (file) {
                          setFileName(file?.name)


                          console.log(URL.createObjectURL(file));
                        }

                      }}
                      readOnly
                    />
                  </div>
                </div>
                <div className="w-full lg:w-3/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                    </label>

                    <button className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        myRef.current?.click()
                      }}
                    >

                      <FontAwesomeIcon icon={faUpload} />{" "}
                    </button>
                  </div>
                </div>

              </div>

              <hr className="mt-6 border-b-1 border-blueGray-300" />


              <div className="flex items-center justify-center flex-wrap">
                <div className="w-3/12  lg:w-12/12 px-4">
                  <div className="relative  center mb-3">
                    <button className="border-0 px-3 px-2-5 my-4 placeholder-blueGray-300 text-blueGray-600 bg-white rounded border-2 text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      type="submit">
                      Create Document
                    </button>
                  </div>
                </div>
              </div>

            </form>

          </div></>

      </div >
    </>
  );
}
