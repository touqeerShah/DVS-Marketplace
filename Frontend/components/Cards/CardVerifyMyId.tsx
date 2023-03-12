import React from "react";
import {
  faFingerprint,
  faFile,
  faIdCard,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useApolloClient } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ethers, Signer } from "ethers";
import { toast } from "react-toastify";
import { create } from "ipfs-http-client";
import { useEffect, useState } from "react";

import CardUserDetails from "../../components/Cards/CardUserDetails";
import { UserIdVoucherStruct } from "../../class/typechain-types/contracts/core/UserIdentityNFT";
import { ContractAddress } from "../../config/";
import { StateType } from "../../config";
import { useAppSelector } from "./../../redux/hooks";
import { web3ProviderReduxState } from "./../../redux/reduces/web3ProviderRedux";
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

export default function CardVerifyMyId(props: any) {
  let web3ProviderState: StateType = useAppSelector(web3ProviderReduxState);
  const validationSchema = Yup.object().shape({
    // image: Yup.string().required("NFG image is required"),
  });

  const subgraphClient = useApolloClient();

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const [url, setURL] = useState("");
  const [idVerifedAndIssuedResponse, setIdVerifedAndIssuedResponse] =
    useState<IdVerifedAndIssuedResponse>();
  const [issueDigitalIdentity, setIssueDigitalIdentity] =
    useState<IssueDigitalIdentity>();
  const [userIdentityNFTContract, setUserIdentityNFTContract] =
    useState<ethers.Contract>();
  const [figurePrintOracleContract, setFigurePrintOracleContract] =
    useState<ethers.Contract>();
  const [linkToken, setLinkToken] = useState<ethers.Contract>();
  const [userRecord, setUserRecord] = useState<VerifcaitonRecord>();
  const [userLinkBalance, setUserLinkBalance] = useState(0);
  let [uri, setURI] = useState("")
  const [verificationEntity, setVerificationEntity] = useState<VerificationEntity>()

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
      let resp = await post("get", {
        data: JSON.stringify({
          transactionCode: "002",
          apiName: "api/getVerificationDetails",
          parameters: {
            userId: userRecord?.userId,
          },
          userId: "user1",
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
        setVerificationEntity(resp.data)
      }
      console.log("resp", resp);

    }
    if (userRecord) {
      fetchData()
    }

  }, [])
  useEffect(() => {
    const fetchData = async () => {
      if (web3ProviderState.web3Provider) {
        const signer = await web3ProviderState.web3Provider.getSigner();
        let userIdentityNFTContract = await getUserIdentityNFT(signer);
        setUserIdentityNFTContract(userIdentityNFTContract);
        let figurePrintOracleContract = await getFigurePrintOracle(signer);
        setFigurePrintOracleContract(figurePrintOracleContract);
        let linkToken = await getLinkToken(signer);
        setLinkToken(linkToken);

        let userRecord: any = await figurePrintOracleContract.getUserRecord(
          web3ProviderState.address
        );
        const idVerifedAndIssuedResponse = await subgraphClient.query({
          query: GET_MY_VERIFICATION_REQUEST_DATA,
          variables: {
            userAddress: web3ProviderState.address,
          },
        });
        if (idVerifedAndIssuedResponse.data?.idVerifedAndIssueds.length > 0) {
          setIdVerifedAndIssuedResponse(
            idVerifedAndIssuedResponse.data?.idVerifedAndIssueds[0]
          );
        }
        const issueDigitalIdentity = await subgraphClient.query({
          query: REDEEM_USER_NFT,
          variables: {
            userAddress: web3ProviderState.address,
          },
        });
        console.log("issueDigitalIdentity.data?.", issueDigitalIdentity.data);

        if (issueDigitalIdentity.data?.issueDigitalIdentities.length > 0) {
          setIssueDigitalIdentity(
            issueDigitalIdentity.data?.issueDigitalIdentities[0]
          );
        }
        let userLinkBalance = await figurePrintOracleContract.getLinkBalance()
        // console.log("userLinkBalance", userLinkBalance);

        // console.log("userRecord?.status", userRecord["2"].toString(), userRecord["2"].toString() === "0");

        setUserLinkBalance(userLinkBalance);
        setUserRecord({
          userId: userRecord["0"].toString(),
          numberTries: parseInt(userRecord["1"].toString()), //no more the 3 request if case of Rejection
          status: parseInt(userRecord["2"].toString()), //
        });
      }
    };

    if (!figurePrintOracleContract) {
      console.log("figurePrintOracleContract", figurePrintOracleContract);

      fetchData();
    }
  }, [web3ProviderState]);

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
    if (
      userRecord?.status == 0 ||
      (userRecord?.status == 3 && userRecord?.numberTries < 3)
    ) {
      let voucher: Partial<UserIdVoucherStruct> = {};

      if (web3ProviderState.web3Provider) {
        const signer = await web3ProviderState.web3Provider.getSigner();
        // let userIdentityNFTContract = await getUserIdentityNFT(signer)
        // let figurePrintOracleContract = await getFigurePrintOracle(signer)
        // console.log(await figurePrintOracleContract.getUserRecord(await signer.getAddress()));

        const _userId = getStringToBytes(props.username);
        const _fingurePrint = getStringToBytes(props.fingerPrintHash);
        let imageObject = JSON.stringify({
          image: "",
          firstName: props.firstName,
          lastName: props.lastName,
          aboutMe: props.aboutMe,
          username: props.username,
        });
        let uri: string = "";
        try {
          const added = await client.add(imageObject);
          // ipfs = `${INFURA_GATEWAY_URL}${added.path}`;
          uri = `https://ipfs.io/ipfs/${added.path}`;
          console.log('uri', uri);

          setURL(uri);
        } catch (error) {
          toast.error("something is wrong with IPFS");
          return "";
        }
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

          console.log("url", url);

          console.log("voucher", voucher);
        } catch (error: any) {
          console.log(error.message.substring(0, error.message.indexOf("("))); // "Hello"
          toast.error(error.message.substring(0, error.message.indexOf("(")));
          return
        }

        try {
          let isLinkTransfer = false;
          console.log("userLinkBalance", userLinkBalance);

          if (userLinkBalance < ethers.parseEther("0.1")) {
            if (linkToken) {
              // await linkToken.transfer(ContractAddress.UserIdentityNFT)
              let tx = await linkToken.transferAndCall(
                ContractAddress.FigurePrintOracle,
                ethers.parseEther("0.1"),
                _userId
              );
              // await tx.wait(1)
              isLinkTransfer = true;
            }
          } else {
            isLinkTransfer = true;
          }
          console.log("_userId", _userId, "_fingurePrint", _fingurePrint);
          if (userIdentityNFTContract && isLinkTransfer) {
            await userIdentityNFTContract.verifyFingerPrint(
              _userId,
              _fingurePrint
            );
            await post("addQueue", {
              data: JSON.stringify({
                transactionCode: "002",
                apiName: "api/createVerificationRecord",
                parameters: {
                  userId: voucher.userId,
                  creator: web3ProviderState.address,
                  uri: voucher.uri,
                  fingerPrint: voucher.fingerPrint,
                  status: "1",
                  signature: voucher.signature
                },
                userId: "user1",
                organization: "org1"
              })
            });
          }

          // "userId",
          // "creator",
          // "uri",
          // "fingerPrint",
          // "status",
          // "signature"

          // (await tx).wait();
        } catch (error: any) {
          console.log(error);

          console.log(error.message.substring(0, error.message.indexOf("("))); // "Hello"
          toast.error(error.message.substring(0, error.message.indexOf("(")));
          return;
        }
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
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </div>}
    </>
  );
}
