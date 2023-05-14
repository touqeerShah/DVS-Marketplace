import { IChainData } from '../lib/types'
import { Web3Provider } from "@ethersproject/providers"

export { ContractAddress } from "./contractAddress"
export { GovernorContract, TimeLock, LinkToken, OrcaleUrlProvider, FigurePrintOracle, UserIdentityNFT, DocumentSignature, MockOracleABI } from "./ContractABI"
export type StateType = {
    library: Web3Provider | undefined
    account?: string | null
    chainId?: number
    active?: boolean | false
}


export type PinState = {
    status: boolean
    toSavePin: boolean
}

export type PinHash = {
    pinhash: string
}



export type ActionType =
    | {
        type: 'SET_WEB3_PROVIDER'
        library?: StateType['library']
        account?: StateType['account']
        chainId?: StateType['chainId']
        active?: StateType['active']

    }
    | {
        type: 'SET_ACCOUNT'
        account?: StateType['account']
    }
    | {
        type: 'SET_CHAIN_ID'
        chainId?: StateType['chainId']
    }
    | {
        type: 'SET_ACTIVE'
        active?: StateType['active']
    }
    | {
        type: 'RESET_WEB3_PROVIDER'
    }


