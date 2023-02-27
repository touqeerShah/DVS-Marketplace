import { IChainData } from '../lib/types'
import { Web3Provider } from "@ethersproject/providers"

export type StateType = {
    provider: any
    web3Provider: Web3Provider | undefined
    address?: string
    chainId?: number
    chainData?: IChainData
}

export type ActionType =
    | {
        type: 'SET_WEB3_PROVIDER'
        provider?: StateType['provider']
        web3Provider?: StateType['web3Provider']
        address?: StateType['address']
        chainId?: StateType['chainId']
    }
    | {
        type: 'SET_ADDRESS'
        address?: StateType['address']
    }
    | {
        type: 'SET_CHAIN_ID'
        chainId?: StateType['chainId']
    }
    | {
        type: 'RESET_WEB3_PROVIDER'
    }

