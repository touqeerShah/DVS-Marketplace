export type TypeContractAddress = {
    TimeLock: string
    GovernorContract: string
    OrcaleUrlProvider: string
    FigurePrintOracle: string
    UserIdentityNFT: string
    DocumentSignature: string
    LinkToken: string
    MockOracle: string
}

export type VerifcaitonRecord = {
    userId: string;
    numberTries: number; //no more the 3 request if case of Rejection
    status: number; //
}

export type VerificationEntity = {
    userId: string;
    creator: string;
    uri: string
    fingerPrint: string;
    status: string;
    signature: string;
}