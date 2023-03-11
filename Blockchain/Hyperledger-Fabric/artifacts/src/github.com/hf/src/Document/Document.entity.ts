
import { BaseEntity } from "../core/doc-mangement/base.entity";

export class DocumentEntity extends BaseEntity {
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
    singers: Signer[]
}

export class Signer {
    tokenId: number;
    signature: string;
    status: string;
}


export class DocumentCount {
    createdByMe: number;
    forMeSignature: number;
    signByMe: number;
}