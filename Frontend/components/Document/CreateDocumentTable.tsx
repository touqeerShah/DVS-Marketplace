import React, { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import PropTypes from "prop-types";

import { post } from "./../../utils/"
// components 

import AddRow from "./DocumentTableRow";
import { StateType } from "../../config"
import { DocumentEntity } from './../../class/document'
import { useAppSelector } from "./../../redux/hooks"
import { web3ProviderReduxState } from "./../../redux/reduces/web3ProviderRedux"

import { REDEEM_USER_NFT } from "./../../lib/subgrapQueries"

export default function CreateDocumentTable(props: any) {
  let web3ProviderState: StateType = useAppSelector(web3ProviderReduxState);
  const subgraphClient = useApolloClient();
  const [myDocuments, setMyDocuments] = useState([])
  const [documentRequestType, setDocumentRequestType] = useState("Owner")
  const [tokenId, setTokenId] = useState(0)

  let getDocumentData = async (documentRequestType: string) => {
    if (web3ProviderState.web3Provider && web3ProviderState.address) {
      let address: string = web3ProviderState.address
      const isExist = await subgraphClient.query({
        query: REDEEM_USER_NFT,
        variables: {
          userAddress: address.toString(),
        },
      });
      let tokenId: number = isExist.data?.issueDigitalIdentities[0].tokenId
      setTokenId(tokenId)
      let query = {}
      if (documentRequestType == "Owner") {
        query = { "selector": { "creator": address } }
      } else if (documentRequestType == "ForSignature") {
        console.log("hereemksdmkaldmnkaldklaskd");

        query = { "selector": { "singers": { "$elemMatch": { "tokenId": parseInt(tokenId.toString()), "signature": "" } } } }
      } else {
        query = { "selector": { "singers": { "$elemMatch": { "tokenId": parseInt(tokenId.toString()), "signature": { "$gt": null } } } } }
      }
      console.log(documentRequestType, "query", query);

      let response = await post("get", {
        data: JSON.stringify({
          transactionCode: "002",
          apiName: "api/getByQuery",
          parameters: {
            query: query
          },
          userId: "user1",
          organization: "org1"
        })
      })
      if (response.status == 200) {
        console.log("response", response.data.slice(0, response.data.length - 1));

        setMyDocuments(response.data.slice(0, response.data.length - 1))
      }

    }
  }
  useEffect(() => {

    console.log('myDocuments', web3ProviderState);

    if (myDocuments.length == 0) {
      console.log('myDocuments', myDocuments);
      // setMyDocuments([])
      getDocumentData(documentRequestType)
    }
  }, [web3ProviderState])

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (props.color === "light" ? "bg-white" : "bg-blueGray-700 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 w-full py-3 border-0">
          <div className="flex float-left w-9/12	 flex-wrap items-center">
            <div className="relative px-4 mb-3 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (props.color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                {props.pageTitle}
              </h3>
            </div>
          </div>
          <div className="relative float-left	 w-3/12  flex-grow flex-1">
            <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              name="lunchStatus" id="challenge"
              // defaultValue={'Owner'}

              key={props.id}
              // onKeyDown={(e) => { _handleKeyDown(e, props.id) }}

              onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                console.log("e.currentTarget.value", e.currentTarget.value);

                setDocumentRequestType(e.currentTarget.value)
                setMyDocuments([])
                getDocumentData(e.currentTarget.value);
                // handleChange(e, props.id)
              }}>
              <option value="Owner">Created By Me</option>
              <option value="ForSignature">For Signature</option>
              <option value="SignByMe">Sign By Me</option>


            </select>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-sm  uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (props.color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Document Id
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-sm  uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (props.color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Name
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-sm  uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (props.color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Create Address
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-sm  uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (props.color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  Creation Time
                </th>

                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-sm  uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (props.color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-blueGray-600 text-blueGray-200 border-blueGray-500")
                  }
                >
                  {""}
                </th>

              </tr>
            </thead>
            <tbody>
              {myDocuments &&
                myDocuments.map((item: DocumentEntity, i) => (
                  <AddRow
                    key={i}
                    documentId={item.documentId}
                    documentName={item.documentName}
                    creatorAddress={item.creator}
                    documentDetails={item}
                    createdAt={item.createdAt}
                    web3ProviderState={web3ProviderState}
                    setMyDocuments={setMyDocuments}
                    documentRequestType={documentRequestType}
                    tokenId={tokenId}
                    color={""} />
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CreateDocumentTable.defaultProps = {
  color: "light",
  pageTitle: ""
};

CreateDocumentTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
