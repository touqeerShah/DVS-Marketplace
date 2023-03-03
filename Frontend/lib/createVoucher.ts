import { VoidSigner, Signer } from "@ethersproject/abstract-signer";
// import { Signer } from "ethers";

export async function castVote(
  signer: Signer,
  tokenId: number,
  documentId: number,
  signingDomain: string,
  signatureVersion: string,
  chainId: string,
  contractAddress: string
) {
  const voucher = { tokenId, documentId };
  const domain = {
    name: signingDomain,
    version: signatureVersion,
    verifyingContract: contractAddress,
    chainId,
  };
  const types = {
    createDocument: [
      { name: "tokenId", type: "uint256" },
      { name: "documentId", type: "uint256" },
    ],
  };
  const signature = await (signer as VoidSigner)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return signature;
}

export async function createUserId(
  signer: Signer,
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

  const signature = await (signer as VoidSigner)._signTypedData(domain, types, voucher);
  const _voucher = {
    ...voucher,
    signature,
  };
  return _voucher;
}


