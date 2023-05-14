// import { VoidSigner, JsonRpcSigner } from "@ethersproject/abstract-signer";
import { JsonRpcSigner } from "@ethersproject/providers"


import { IDocumentSignature } from "../class/typechain-types/contracts/core/DocumentSignature"

export async function createDocument(
  signer: JsonRpcSigner,
  creator: string,
  uri: string,
  documentId: number,
  signingDomain: string,
  signatureVersion: string,
  chainId: string,
  contractAddress: string
) {
  const voucher = { creator, documentId, uri };
  const domain = {
    name: signingDomain,
    version: signatureVersion,
    verifyingContract: contractAddress,
    chainId,
  };
  const types = {
    createDocument: [
      { name: "creator", type: "address" },
      { name: "documentId", type: "uint256" },
      { name: "uri", type: "string" },
    ],
  };
  const signature = await (signer)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return signature;
}

export async function processDocumentWithSignature(
  signer: JsonRpcSigner,
  creator: string,
  name: string,
  description: string,
  parties: Array<IDocumentSignature.PartyStruct>,
  status: number,
  signatureStart: number,
  signatureEnd: number,
  documentId: number,
  uri: string,
  signingDomain: string,
  signatureVersion: string,
  chainId: string,
  contractAddress: string
) {
  const voucher = {
    creator,
    name,
    description,
    parties,
    status,
    signatureStart,
    signatureEnd,
    documentId,
    uri,
  };
  const domain = {
    name: signingDomain,
    version: signatureVersion,
    verifyingContract: contractAddress,
    chainId,
  };
  const types = {
    DocumentDetialsWithSigature: [
      { name: "creator", type: "address" },
      { name: "name", type: "bytes" },
      { name: "description", type: "bytes" },
      { name: "parties", type: "IDocumentSignature.PartyStruct[]" },
      { name: "status", type: "DocumentState" },
      { name: "signatureStart", type: "uint64" },
      { name: "signatureEnd", type: "uint64" },
      { name: "documentId", type: "uint256" },
      { name: "uri", type: "string" },
    ],
  };
  const signature = await (signer)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return _voucher;
}

export async function createUserId(
  signer: JsonRpcSigner,
  userId: string,
  uri: string,
  fingerPrint: string,
  signingDomain: string,
  signatureVersion: string,
  chainId: string,
  contractAddress: string
) {
  const voucher = { uri, userId, fingerPrint };
  const domain = {
    name: signingDomain,
    version: signatureVersion,
    verifyingContract: contractAddress,
    chainId,
  };
  const types = {
    createUserId: [
      { name: "uri", type: "string" },
      { name: "userId", type: "bytes" },
      { name: "fingerPrint", type: "bytes" },
    ],
  };
  // console.log("types", types);

  const signature = await (signer)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return _voucher;
}


