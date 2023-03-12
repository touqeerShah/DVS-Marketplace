export interface AddItemArg {
    lotId: string, itemsId: string[]
}
export interface DocumentEntityArg {
    documentId: string;
    documentName: string;
    purpose: string;
    uri: string;
    startData: string;
    expirationDate: string;
    startBlock: string;
    endBlock: string;
    creator: string; // A -> B ->C
    creatorTokenId: string, // A -> B ->C

    ownerSignature: string;
    parties: number[]
}
export interface AddSignatureDocument {
    documentId: string,
    signature: string,
    signer: number,
}

export interface UpdateStatusDocument {
    documentId: string,
    status: string,
}

