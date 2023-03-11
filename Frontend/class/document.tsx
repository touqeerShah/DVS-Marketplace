export type DocumentSigner = {
    userId: string
}
type AddDivFields = {
    id: number
}


export type TypeDocumentSignerFields = AddDivFields & DocumentSigner


export type DocumentEntity = {
    documentId: string;
    documentName: string;
    purpose: string;
    uri: string;
    startData: string;
    expirationDate: string;
    startBlock: string;
    endBlock: string;
    creator: string;
    ownerSignature: string;
    status: string;
    createdBy: string;
    updatedBy: string;
    updatedAt: any;
    createdAt: any;
    txID: string;
    singers: Signer[]
}

export type Signer = {
    tokenId: number;
    signature: string;
    status: string;
}

export type UriData = {
    file: string,
    fileName: string,
}