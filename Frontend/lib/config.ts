export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;
export const INFURA_IPFS_PROJECJECT_ID =
    process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECJECT_ID; // "";
export const INFURA_IPFS_PROJECJECT_SECRET =
    process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECJECT_SECRET;
export const INFURA_URL = process.env.NEXT_PUBLIC_IINFURA_URL; //"ipfs.infura.io";
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
export const HUGGING_FACE_API_KEY = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY; //"";

export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUB_GRAPH
export const ALCHMEY_KEY = process.env.NEXT_PUBLIC_ALCHMEY_KEY

export const NFT_STORAGE = process.env.NEXT_PUBLIC_NFT_STORAGE
export const NEW_STORE_VALUE = 77
export const FUNC = "setUrl"
export const PROPOSAL_DESCRIPTION = "Proposal #1 Update Orcale endpint!"
export const ORCALE_URL_PROVIDER = process.env.OrcaleUrlProvider || "";
export const ORCALE_URL_PROVIDER2 = "https://user-id/explorer/";
export const ETHERSCANAPIKEY = "E68FRNFXV8W9IC7ZVYUQ4WNZRH7MRXURV8"

export const JOB_ID = "7d80a6386ef543a3abb52817f6707e3b"
export const SIGNING_DOMAIN_NAME = "User-Identity"
export const SIGNING_DOMAIN_VERSION = "1"
export const NFT_NAME = "User-Identity"
export const NFT_SYMBOL = "786"

export const DS_SIGNING_DOMAIN_NAME = "Doc-Sign"
export const DS_SIGNING_DOMAIN_VERSION = "1"
export const DS_NFT_NAME = "Doc-Sign"
export const DS_NFT_SYMBOL = "DS_786"


export const AVERAGE_BLOCK_MINT_TIME = 10
export const IPFS_SIMPLE = process.env.IPFS_SIMPLE || ""

export const BACKEND_ENDPOINT = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT


export enum ConnectorNames {
    Metamask = "Metamask",
    WalletConnect = "Wallet Connect",
    WalletLink = "Wallet Link",
    Trezor = "Trezor"
};
export const mainNetworkChainId = {
    ethereum: 1,
    binance: 56,
    polygon: 137,
    sepolia: 11155111
};
export const testNetworkChainId = {
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
    binance: 97,
    polygon: 80001,
    sepolia: 11155111

};

export const mainNetworkRPC = {
    ethereum: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    binance: "https://bsc-dataseed.binance.org",
    polygon: "https://polygon-rpc.com"
};
export const testNetworkRPC = {
    binance: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    ropsten: `https://ropsten.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    rinkeby: `https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    goerli: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    sepolia: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,

    kovan: `https://kovan.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    polygon: "https://rpc-mumbai.matic.today"
};
