import { ethers, Signer } from "ethers";

import { ContractAddress, DocumentSignature, MockOracleABI, UserIdentityNFT, OrcaleUrlProvider, LinkToken, FigurePrintOracle, TimeLock, GovernorContract } from "./../config/"


export default async function getMockOracle(signer: any): Promise<ethers.Contract> {
  let mockOracle = new ethers.Contract(ContractAddress.MockOracle, MockOracleABI, signer);
  return mockOracle;
}
export async function getOrcaleUrlProvider(signer: any): Promise<ethers.Contract> {
  let orcaleUrlProvider = new ethers.Contract(ContractAddress.OrcaleUrlProvider, OrcaleUrlProvider, signer);
  return orcaleUrlProvider;
}
export async function getLinkToken(signer: any): Promise<ethers.Contract> {
  let linkToken = new ethers.Contract(ContractAddress.LinkToken, LinkToken, signer);
  return linkToken;
}
export async function getFigurePrintOracle(signer: any): Promise<ethers.Contract> {
  let figurePrintOracle = new ethers.Contract(ContractAddress.FigurePrintOracle, FigurePrintOracle, signer);
  return figurePrintOracle;
}
export async function getUserIdentityNFT(signer: any): Promise<ethers.Contract> {
  let userIdentityNFT = new ethers.Contract(ContractAddress.UserIdentityNFT, UserIdentityNFT, signer);
  return userIdentityNFT;
}
export async function getDocumentSignature(signer: any): Promise<ethers.Contract> {
  let documentSignature = new ethers.Contract(ContractAddress.DocumentSignature, DocumentSignature, signer);
  return documentSignature;
}
export async function getTimeLock(signer: any): Promise<ethers.Contract> {
  let timeLock = new ethers.Contract(ContractAddress.TimeLock, TimeLock, signer);
  return timeLock;
}
export async function getGovernorContract(signer: any): Promise<ethers.Contract> {
  let governorContract = new ethers.Contract(ContractAddress.GovernorContract, GovernorContract, signer);
  return governorContract;
}