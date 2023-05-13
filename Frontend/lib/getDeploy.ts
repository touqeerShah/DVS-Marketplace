
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from "@ethersproject/contracts";
import { ContractAddress, DocumentSignature, MockOracleABI, UserIdentityNFT, OrcaleUrlProvider, LinkToken, FigurePrintOracle, TimeLock, GovernorContract } from "./../config/"


export default async function getMockOracle(library: Web3Provider | undefined): Promise<Contract | undefined> {
  if (library) {
    let mockOracle = new Contract(ContractAddress.MockOracle, MockOracleABI, library.getSigner());
    return mockOracle;
  }
  return undefined;
}
export async function getOrcaleUrlProvider(library: Web3Provider | undefined): Promise<Contract | undefined> {
  if (library) {
    let orcaleUrlProvider = new Contract(ContractAddress.OrcaleUrlProvider, OrcaleUrlProvider, library.getSigner());
    return orcaleUrlProvider;
  }
  return undefined;

}
export async function getLinkToken(library: Web3Provider | undefined): Promise<Contract | undefined> {
  if (library) {
    let linkToken = new Contract(ContractAddress.LinkToken, LinkToken, library.getSigner());
    return linkToken;
  }
  return undefined;

}
export async function getFigurePrintOracle(library: Web3Provider | undefined): Promise<Contract | undefined> {
  if (library) {
    let figurePrintOracle = new Contract(ContractAddress.FigurePrintOracle, FigurePrintOracle, library.getSigner());
    return figurePrintOracle;
  }
  return undefined;

}
export async function getUserIdentityNFT(library: Web3Provider | undefined): Promise<Contract | undefined> {
  if (library) {
    let userIdentityNFT = new Contract(ContractAddress.UserIdentityNFT, UserIdentityNFT, library.getSigner());
    return userIdentityNFT;
  }
  return undefined;

}
export async function getDocumentSignature(library: Web3Provider | undefined): Promise<Contract | undefined> {
  if (library) {
    let documentSignature = new Contract(ContractAddress.DocumentSignature, DocumentSignature, library.getSigner());
    return documentSignature;
  }
  return undefined;

}
export async function getTimeLock(library: Web3Provider | undefined): Promise<Contract | undefined> {
  if (library) {
    let timeLock = new Contract(ContractAddress.TimeLock, TimeLock, library.getSigner());
    return timeLock;
  }
  return undefined;

}
export async function getGovernorContract(library: Web3Provider | undefined): Promise<Contract | undefined> {
  if (library) {
    let governorContract = new Contract(ContractAddress.GovernorContract, GovernorContract, library.getSigner());
    return governorContract;
  }
  return undefined;

}