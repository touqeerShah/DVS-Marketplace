/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { promises } from "dns";
import {
    Context,
    Contract,
    Info,
    Returns,
    Transaction,
} from "fabric-contract-api";
import { Configs } from "./configs";
import { ContextProvider } from "./core/context/context.provider";
import { BadRequestError } from "./core/eror/bad-request-error";
import { ErrorStatusCode } from "./core/eror/base-error"
import { UserEntity } from "./user/user.entity";
import { UserVerificationProvider } from "./user/user.provider";

import { DocumentEntity } from "./Document/Document.entity";
import { DocumentProvider } from "./Document/Document.provider";

import { VerificationEntity } from "./userVerificationRequest/userVerificationRequest.entity";
import { UserVerificationRequestProvider } from "./userVerificationRequest/userVerificationRequest.provider";


import { CreateUserVerificationArg } from "./user/user.interface"
import { VerificationEntityArg } from "./userVerificationRequest/userVerificationRequest.interface"
import { DocumentEntityArg, AddSignatureDocument, UpdateStatusDocument } from "./Document/Document.interface"

@Info({ title: "CompanyRegistationContract", description: "CompanyRegistationContract" })
export class CompanyRegistationContract extends Contract {


    /**
     * this function is get details of site
     * siteObject = '{"siteid":"pharmaTrace_786"}'
     * @param ctx 
     * @param userObject  object contain site id
     * @returns 
     */
    @Transaction()
    public async existsDocument(
        ctx: Context,
        userObject: string,
    ): Promise<boolean | string> {
        let requestJson = JSON.parse(userObject);

        const documentProvider = new DocumentProvider(ctx); // create object provider
        requestJson = await documentProvider.existsDocument(requestJson.userId);
        if (typeof requestJson === 'string') {
            // 👇️ myVar has type string here
            return requestJson;
        }
        return requestJson;
    }



    /**
   * this function is get details of site
   * siteObject = '{"siteid":"pharmaTrace_786"}'
   * @param ctx 
   * @param userObject  object contain site id
   * @returns 
   */
    @Transaction()
    public async getDocumentDetails(
        ctx: Context,
        userObject: string,
    ): Promise<DocumentEntity | string> {
        let requestJson = JSON.parse(userObject);

        const documentProvider = new DocumentProvider(ctx); // create object provider
        requestJson = await documentProvider.getDocumentDetails(requestJson.userId);
        if (typeof requestJson === 'string') {
            // 👇️ myVar has type string here
            return requestJson;
        }
        return requestJson;
    }


    /**
     * this function is get details of site
     * siteObject = '{"siteid":"pharmaTrace_786"}'
     * @param ctx 
     * @param siteObject  object contain site id
     * @returns 
     */
    @Transaction()
    public async getByQuery(
        ctx: Context,
        siteObject: string,
    ): Promise<any[] | string> {
        let requestJson = JSON.parse(siteObject);

        const documentProvider = new DocumentProvider(ctx); // create object provider
        requestJson = await documentProvider.getByQuery(requestJson.query);
        if (typeof requestJson === 'string') {
            // 👇️ myVar has type string here
            return requestJson;
        }



        let lotData: any[] = requestJson

        return lotData;
    }


    // This fucntion will use to create lot object into blockchain which details will filled in feture
    // var requestString = 
    // above is the example is for required parameter
    @Transaction()
    public async updateStatusDocument(
        ctx: Context,
        requestString: string
    ): Promise<DocumentEntity | string> {
        let requestJson: UpdateStatusDocument
        try {
            requestJson = JSON.parse(requestString); // convert json string into json

        } catch (error) {
            error = BadRequestError.throw(`Object Not valid`, ErrorStatusCode.badRequest);
            return error;
        }
        // provider is class which will get the argument and call different funcution on that argument like validate the argument and put them into blockchain
        const documentProvider = new DocumentProvider(ctx); // create object provider

        console.log("before", requestJson);
        let creationResponse = await documentProvider.updateStatusDocument(
            requestJson.documentId,
            requestJson.status,
        );
        console.log("requestJson", creationResponse);

        if (typeof creationResponse === 'string') {
            // 👇️ myVar has type string here
            return creationResponse;
        }
        let userEntity: DocumentEntity = creationResponse
        const eventData = { userEntity: [userEntity] }; // create event on scuccessfull record data into blockchain
        const contextProvider = new ContextProvider(ctx);
        contextProvider.raiseEvent(Configs.events.addSignatureDocument, eventData);

        return userEntity;
    }


    // This fucntion will use to create lot object into blockchain which details will filled in feture
    // var requestString = 
    // above is the example is for required parameter
    @Transaction()
    public async addSignatureDocument(
        ctx: Context,
        requestString: string
    ): Promise<DocumentEntity | string> {
        let requestJson: AddSignatureDocument
        try {
            requestJson = JSON.parse(requestString); // convert json string into json

        } catch (error) {
            error = BadRequestError.throw(`Object Not valid`, ErrorStatusCode.badRequest);
            return error;
        }
        // provider is class which will get the argument and call different funcution on that argument like validate the argument and put them into blockchain
        const documentProvider = new DocumentProvider(ctx); // create object provider

        console.log("before", requestJson);
        let creationResponse = await documentProvider.addSignatureDocument(
            requestJson.documentId,
            requestJson.signature,
            requestJson.signer,
        );
        console.log("requestJson", creationResponse);

        if (typeof creationResponse === 'string') {
            // 👇️ myVar has type string here
            return creationResponse;
        }
        let userEntity: DocumentEntity = creationResponse
        const eventData = { userEntity: [userEntity] }; // create event on scuccessfull record data into blockchain
        const contextProvider = new ContextProvider(ctx);
        contextProvider.raiseEvent(Configs.events.addSignatureDocument, eventData);

        return userEntity;
    }


    // This fucntion will use to create lot object into blockchain which details will filled in feture
    // var requestString = 
    // above is the example is for required parameter
    @Transaction()
    public async createDocument(
        ctx: Context,
        requestString: string
    ): Promise<DocumentEntity | string> {
        let requestJson: DocumentEntityArg
        try {
            requestJson = JSON.parse(requestString); // convert json string into json

        } catch (error) {
            error = BadRequestError.throw(`Object Not valid`, ErrorStatusCode.badRequest);
            return error;
        }
        // provider is class which will get the argument and call different funcution on that argument like validate the argument and put them into blockchain
        const documentProvider = new DocumentProvider(ctx); // create object provider

        console.log("before", requestJson);
        let creationResponse = await documentProvider.createDocument(
            requestJson.documentId,
            requestJson.documentName,
            requestJson.purpose,
            requestJson.uri,
            requestJson.startData,
            requestJson.expirationDate,
            requestJson.startBlock,
            requestJson.endBlock,
            requestJson.creator, // A -> B ->C
            requestJson.ownerSignature,
            requestJson.parties);
        console.log("requestJson", creationResponse);

        if (typeof creationResponse === 'string') {
            // 👇️ myVar has type string here
            return creationResponse;
        }
        let userEntity: DocumentEntity = creationResponse
        const eventData = { userEntity: [userEntity] }; // create event on scuccessfull record data into blockchain
        const contextProvider = new ContextProvider(ctx);
        contextProvider.raiseEvent(Configs.events.documentCreation, eventData);

        return userEntity;
    }


    // This fucntion will use to create lot object into blockchain which details will filled in feture
    // var requestString = 
    // above is the example is for required parameter
    @Transaction()
    public async createVerificationRecord(
        ctx: Context,
        requestString: string
    ): Promise<VerificationEntity | string> {
        let requestJson: VerificationEntityArg
        try {
            requestJson = JSON.parse(requestString); // convert json string into json

        } catch (error) {
            error = BadRequestError.throw(`Object Not valid`, ErrorStatusCode.badRequest);
            return error;
        }
        // provider is class which will get the argument and call different funcution on that argument like validate the argument and put them into blockchain
        const userVerificationRequestProvider = new UserVerificationRequestProvider(ctx); // create object provider

        console.log("before", requestJson);
        let creationResponse = await userVerificationRequestProvider.createVerificationRecord(
            requestJson.userId,
            requestJson.creator,
            requestJson.uri,
            requestJson.signature,
            requestJson.status,
            requestJson.fingerPrint);
        console.log("requestJson", creationResponse);

        if (typeof creationResponse === 'string') {
            // 👇️ myVar has type string here
            return creationResponse;
        }
        let userEntity: VerificationEntity = creationResponse
        const eventData = { userEntity: [userEntity] }; // create event on scuccessfull record data into blockchain
        const contextProvider = new ContextProvider(ctx);
        contextProvider.raiseEvent(Configs.events.createVerificationRecord, eventData);

        return userEntity;
    }


    // This fucntion will use to create lot object into blockchain which details will filled in feture
    // var requestString = 
    // above is the example is for required parameter
    @Transaction()
    public async updateStatus(
        ctx: Context,
        requestString: string
    ): Promise<VerificationEntity | string> {
        let requestJson: VerificationEntityArg
        try {
            requestJson = JSON.parse(requestString); // convert json string into json

        } catch (error) {
            error = BadRequestError.throw(`Object Not valid`, ErrorStatusCode.badRequest);
            return error;
        }
        // provider is class which will get the argument and call different funcution on that argument like validate the argument and put them into blockchain
        const userVerificationRequestProvider = new UserVerificationRequestProvider(ctx); // create object provider

        console.log("before", requestJson);
        let creationResponse = await userVerificationRequestProvider.updateStatus(
            requestJson.userId,
            requestJson.status);
        console.log("requestJson", creationResponse);

        if (typeof creationResponse === 'string') {
            // 👇️ myVar has type string here
            return creationResponse;
        }
        let userEntity: VerificationEntity = creationResponse
        const eventData = { userEntity: [userEntity] }; // create event on scuccessfull record data into blockchain
        const contextProvider = new ContextProvider(ctx);
        contextProvider.raiseEvent(Configs.events.UpdateVerificationRecord, eventData);

        return userEntity;
    }

    /**
     * this function is get details of site
     * siteObject = '{"siteid":"pharmaTrace_786"}'
     * @param ctx 
     * @param userObject  object contain site id
     * @returns 
     */
    @Transaction()
    public async getVerificationDetails(
        ctx: Context,
        userObject: string,
    ): Promise<UserEntity | string> {
        let requestJson = JSON.parse(userObject);

        const userVerificationRequestProvider = new UserVerificationRequestProvider(ctx); // create object provider
        requestJson = await userVerificationRequestProvider.getVerificationDetails(requestJson.userId);
        if (typeof requestJson === 'string') {
            // 👇️ myVar has type string here
            return requestJson;
        }
        return requestJson;
    }



    // This fucntion will use to create lot object into blockchain which details will filled in feture
    // var requestString = 
    // above is the example is for required parameter
    @Transaction()
    public async createUserVerification(
        ctx: Context,
        requestString: string
    ): Promise<UserEntity | string> {
        let requestJson: CreateUserVerificationArg
        try {
            requestJson = JSON.parse(requestString); // convert json string into json

        } catch (error) {
            error = BadRequestError.throw(`Object Not valid`, ErrorStatusCode.badRequest);
            return error;
        }
        // provider is class which will get the argument and call different funcution on that argument like validate the argument and put them into blockchain
        const userVerificationProvider = new UserVerificationProvider(ctx); // create object provider

        console.log("before", requestJson);
        let creationResponse = await userVerificationProvider.createUserVerification(
            requestJson.userId,
            requestJson.fingerPrint);
        console.log("requestJson", creationResponse);

        if (typeof creationResponse === 'string') {
            // 👇️ myVar has type string here
            return creationResponse;
        }
        let userEntity: UserEntity = creationResponse
        const eventData = { userEntity: [userEntity] }; // create event on scuccessfull record data into blockchain
        const contextProvider = new ContextProvider(ctx);
        contextProvider.raiseEvent(Configs.events.createUserVerification, eventData);

        return userEntity;
    }


    /**
     * this function is get details of site
     * siteObject = '{"siteid":"pharmaTrace_786"}'
     * @param ctx 
     * @param siteObject  object contain site id
     * @returns 
     */
    @Transaction()
    public async userExists(
        ctx: Context,
        siteObject: string,
    ): Promise<boolean | string> {
        let requestJson = JSON.parse(siteObject);

        const userVerificationProvider = new UserVerificationProvider(ctx);

        requestJson = await userVerificationProvider.userExists(requestJson.userId);
        if (typeof requestJson === 'string') {
            // 👇️ myVar has type string here
            return requestJson;
        }

        let isExist: boolean = requestJson
        return isExist;
    }

    /**
     * this function is get details of site
     * siteObject = '{"siteid":"pharmaTrace_786"}'
     * @param ctx 
     * @param userObject  object contain site id
     * @returns 
     */
    @Transaction()
    public async getUserVerificationDetails(
        ctx: Context,
        userObject: string,
    ): Promise<UserEntity | string> {
        let requestJson = JSON.parse(userObject);

        const userVerificationProvider = new UserVerificationProvider(ctx);
        requestJson = await userVerificationProvider.getUserVerificationDetails(requestJson.userId);
        if (typeof requestJson === 'string') {
            // 👇️ myVar has type string here
            return requestJson;
        }

        return requestJson;
    }
    // below function are for company transaction and it related

}
