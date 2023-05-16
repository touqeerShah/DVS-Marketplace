import React, { useState, useEffect } from "react";
import {
  faClockRotateLeft,
  faFileDownload,
  faCheckCircle,
  faGavel,
} from "@fortawesome/free-solid-svg-icons";
// components
import { useApolloClient } from "@apollo/client";
import { StateType } from "../../config";
import { REDEEM_USER_NFT } from "./../../lib/subgrapQueries";
import { IssueDigitalIdentity } from "./../../class/subgraphResponse";

import CardStats from "../../components/Cards/CardStats";
import { useAppSelector, useAppDispatch } from "./../../redux/hooks";
import { web3ProviderReduxState } from "./../../redux/reduces/web3ProviderRedux";
import { DocumentCount } from "../../class/document";
import { post } from "../../utils/";

export default function HeaderStats() {
  const subgraphClient = useApolloClient();
  let web3ProviderState: StateType = useAppSelector(web3ProviderReduxState);
  let [count, setCount] = useState<DocumentCount>({
    createdByMe: 0,
    forMeSignature: 0,
    signByMe: 0,
    NFTCount: 0,
  });
  let isRequested = false
  const [token, setTokenId] = useState("");

  useEffect(() => {
    console.log("0.getDocumentCount", web3ProviderState);

    const fetchData = async () => {
      console.log("01.getDocumentCount", web3ProviderState);

      if (web3ProviderState.active) {
        try {
          const issueDigitalIdentity = await subgraphClient.query({
            query: REDEEM_USER_NFT,
            variables: {
              userAddress: web3ProviderState.account,
            },
          });
          // console.log("issueDigitalIdentity.data?.", issueDigitalIdentity.data);

          if (issueDigitalIdentity.data?.issueDigitalIdentities.length > 0) {
            // console.log("data = = = ", issueDigitalIdentity.data?.issueDigitalIdentities[0] as IssueDigitalIdentity);
            let tem: IssueDigitalIdentity = issueDigitalIdentity.data
              ?.issueDigitalIdentities[0] as IssueDigitalIdentity;
            setTokenId(tem.tokenId);
            let resp = await post("api/get", {
              data: JSON.stringify({
                transactionCode: "002",
                apiName: "getDocumentCount",
                parameters: {
                  documentId: tem.tokenId,
                },
                userId: "user2",
                organization: "org1",
              }),
            });
            console.log("1.getDocumentCount== >/", resp);

            if (resp.status == 200) {
              console.log("getDocumentCount== >", resp);
              let temCount = resp.data as DocumentCount;
              console.log("temCount== >", temCount);

              setCount({
                createdByMe: temCount.createdByMe,
                forMeSignature: temCount.forMeSignature,
                signByMe: temCount.signByMe,
                NFTCount: 1,
              });
            }
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    if (!isRequested && web3ProviderState.chainId) {
      isRequested = true
      fetchData();
    }
  }, [web3ProviderState.chainId]);

  return (
    <>
      {/* Header */}
      <div className="relative bg-black md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Owner Document"
                  statTitle={
                    count?.createdByMe?.toString()
                  }
                  statArrow="up"
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName={faClockRotateLeft}
                  statIconColor="bg-yellow-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="NEW Document"
                  statTitle={
                    count?.forMeSignature?.toString()
                  }
                  statArrow="down"
                  statPercent=""
                  statPercentColor="text-red-500"
                  statDescripiron="Since last week"
                  statIconName={faFileDownload}
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Total Document Sign"
                  statTitle={
                    count?.signByMe?.toString()
                  }
                  statArrow="down"
                  statPercent=""
                  statPercentColor="text-orange-500"
                  statDescripiron="Since yesterday"
                  statIconName={faCheckCircle}
                  statIconColor="bg-green-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="NFT"
                  statTitle={
                    count?.NFTCount?.toString()
                  }
                  statArrow="up"
                  statPercent=""
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last month"
                  statIconName={faGavel}
                  statIconColor="bg-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
