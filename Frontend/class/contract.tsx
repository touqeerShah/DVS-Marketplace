export type TypeContractAddress = {
    TimeLock: string
    GovernorContract: string
    OrcaleUrlProvider: string
    FigurePrintOracle: string
    UserIdentityNFT: string
    DocumentSignature: string
    LinkToken: string
    MockOracle: string
    PTNFT: string
}

export type VerifcaitonRecord = {
    userId: string;
    numberTries: number; //no more the 3 request if case of Rejection
    status: number; //
}
