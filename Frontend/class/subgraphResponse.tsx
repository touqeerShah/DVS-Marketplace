export type IdVerifedAndIssuedResponse = {
    blockNumber: string
    blockTimestamp: string
    id: string
    requestId: string
    transactionHash: string
    userAddres: string
    userId: string
}

export type IssueDigitalIdentity = {
    userId: string
    userAddres: string
    transactionHash: string
    tokenId: string
    id: string
    blockTimestamp: string
    blockNumber: string
}