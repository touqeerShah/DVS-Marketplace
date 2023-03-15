import { Context } from "fabric-contract-api";
import { DocumentEntity, Signer, DocumentCount } from "./Document.entity";
import { DocumentRepository } from "./Document.repository";
import { DocumentValidators } from "./Document.validator";
import { BadRequestError } from "../core/eror/bad-request-error";
import { ErrorStatusCode } from "../core/eror/base-error";
export class DocumentProvider {
    private documentRepository: DocumentRepository;
    private documentValidators: DocumentValidators;

    constructor(ctx: Context) {
        this.documentRepository = new DocumentRepository(ctx, DocumentEntity);
        this.documentValidators = new DocumentValidators();
    }
    /**
     * this function check comapny exist or not
     * @param documentId 
     * @returns 
     */
    public async existsDocument(documentId: string): Promise<boolean> {
        const query = {
            documentId: documentId,
        } as DocumentEntity;
        return await this.documentRepository.exists(query);
    }


    /**
     * function return status of document not all details 
     * @paramtransactionId 
     * @returns 
     */
    public async getByQuery(query: string): Promise<any[] | string> {
        let mspID = this.documentRepository.getMSPID();
        var documentData = await this.documentRepository.getDataByQuery(query, "Document" + mspID);
        if (typeof documentData === 'string') {
            // 👇️ myVar has type string here
            return documentData;
        }
        documentData as any[]
        // let documentData: DocumentEntity = response
        return documentData;
    }
    /**
    * This function is  get detials of document
    * @paramtransactionId 
    * @returns 
    */
    public async getDocumentDetails(documentId: string): Promise<DocumentEntity | string> {
        const query = {
            documentId: documentId,
        } as DocumentEntity;
        let mspID = this.documentRepository.getMSPID();
        return await this.documentRepository.get(query, "Document" + mspID);
    }

    /**
 * This function is  get detials of document
 * @paramtransactionId 
 * @returns 
 */
    public async getDocumentCount(documentId: string): Promise<DocumentCount | string> {
        let mspID = this.documentRepository.getMSPID();
        return await this.documentRepository.getDocumentCount(documentId, "Document" + mspID);
    }


    /**
     * Create document first validate the object the passed it to add more attribut and store into blockchain
     * @param document 
     * @returns 
     */
    public async createDocument(
        documentId: string,
        documentName: string,
        purpose: string,
        uri: string,
        startData: string,
        expirationDate: string,
        startBlock: string,
        endBlock: string,
        creator: string,
        creatorTokenId: string, // A -> B ->C
        ownerSignature: string,
        parties: number[]): Promise<DocumentEntity | string> {
        // let location = new Location();
        let signer: Signer[] = [];
        let mspID = this.documentRepository.getMSPID();

        for (let index = 0; index < parties.length; index++) {
            const element = parties[index];
            // await this.documentRepository.updateDocumentCount(element.toString(), "forMeSignature", "Document" + mspID)
            signer.push({ tokenId: element, signature: "", status: "pending" })
        }
        let document = new DocumentEntity()
        document.documentId = documentId;
        document.documentName = documentName;
        document.purpose = purpose;
        document.uri = uri;
        document.startData = startData;
        document.expirationDate = expirationDate;
        document.startBlock = startBlock;
        document.endBlock = endBlock;
        document.creator = creator; // A -> B ->C
        document.ownerSignature = ownerSignature;
        document.status = "0";
        document.singers = signer

        // location.location = initLocation;
        // location.status = "activated"
        // document.shipmentLocations.push(await this.documentRepository.createLocationList(location)); // it will add common attribute into variable
        console.log("document", document)
        let response = await this.documentValidators.createDocument(document);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }
        let documentData: DocumentEntity = document
        console.log("After Validation", documentData)
        // return document;
        // await this.documentRepository.updateDocumentCount(creatorTokenId, "createdByMe", "Document" + mspID)
        return await this.documentRepository.create(documentData, "Document" + mspID);
    }
    /**
    * update Document  first validate the object the passed it to add more attribut and store into blockchain
    * @param document 
    * @returns 
    */
    public async addSignatureDocument(
        documentId: string,
        signature: string,
        signer: number,
    ): Promise<DocumentEntity | string> {
        // let location = new Location();
        var response = await this.getDocumentDetails(documentId);
        let mspID = this.documentRepository.getMSPID();

        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }

        let documentData: DocumentEntity = response;
        for (let index = 0; index < documentData.singers.length; index++) {
            const element: Signer = documentData.singers[index];
            console.log("element.tokenId === signer", element.tokenId, signer, "  :   ", element.tokenId == signer);

            if (element.tokenId == signer) {
                element.signature = signature
                element.status = "active"
                documentData.singers[index] = element
                await this.documentRepository.updateDocumentCount(signer.toString(), "signByMe", "Document" + mspID)

            }
        }
        console.log("documentData", documentData);

        response = await this.documentValidators.addSignatureDocument(documentData);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }
        return await this.documentRepository.update(documentData, "Document" + mspID);
    }

    /**
  * update Document  first validate the object the passed it to add more attribut and store into blockchain
  * @param document 
  * @returns 
  */
    public async updateStatusDocument(
        documentId: string,
        status: string,

    ): Promise<DocumentEntity | string> {
        // let location = new Location();
        var response = await this.getDocumentDetails(documentId);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }

        let documentData: DocumentEntity = response;
        documentData.status = status
        for (let index = 0; index < documentData.singers.length; index++) {
            const element: Signer = documentData[index];
            element.status = status
            documentData[index] = element;
        }
        response = await this.documentValidators.addSignatureDocument(documentData);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }
        let mspID = this.documentRepository.getMSPID();
        return await this.documentRepository.update(documentData, "Document" + mspID);
    }



}
