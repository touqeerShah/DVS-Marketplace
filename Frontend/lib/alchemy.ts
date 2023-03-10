// Setup: npm install alchemy-sdk
import { Alchemy, Network } from "alchemy-sdk";
import { ALCHMEY_KEY } from "./config";
const config = {
    apiKey: ALCHMEY_KEY,
    network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);
/**
 * Return all the NFT on that collections
 * @param {*} contractAddress
 * @param {*} pageSize
 * @returns
 */
export const getNftsForContract = async (contractAddress: string, pageSize: number) => {
    // Get all NFTs
    var nfts = await alchemy.nft.getNftsForContract(contractAddress, {
        pageSize: pageSize,
    });

    return nfts;
};


export async function getLatestBlockNumber() {
    const latestBlock = await alchemy.core.getBlockNumber();
    console.log("The latest block number is", latestBlock);
    console.log(latestBlock);
    console.log(latestBlock);
    return latestBlock;
}


/**
 * this also return metadate of NFT but it will return in object
 * @param {*} contractAddress
 * @param {*} tokenId
 * @returns
 */
export const getNftMetadataForExplorer = async (contractAddress: string, tokenId: number) => {
    var owner = await alchemy.nft.getOwnersForNft(contractAddress, tokenId);
    return owner; // object with collection address with NFT details as array
};