import { Context } from "fabric-contract-api";
import { ContextProvider } from "../context/context.provider";
import { BadRequestError } from "../eror/bad-request-error";
import { NotFoundError } from "../eror/not-found-error";
import { ErrorStatusCode } from "../eror/base-error"
import { VerificationEntity } from "../../userVerificationRequest/userVerificationRequest.entity";

// const crypto = require('crypto')
import * as crypto from 'crypto';


/**
 * This is wraper class for blockchain function  
 */
export class BaseRepository<T extends VerificationEntity> {
    private contextProvider: ContextProvider;

    constructor(ctx: Context, private type: new () => T) {
        this.contextProvider = new ContextProvider(ctx);
    }

    /**
     * exists is fucntion for check record 
     * @param query 
     * @returns 
     */
    public async exists(query: T): Promise<boolean> {
        const key = this.getKey(query);
        const mspID = this.contextProvider.getTxMSPID();
        const bufferData = await this.contextProvider.get(key, "VerificationEntity" + mspID);
        return !!bufferData && bufferData.length > 0;
    }

    public async get(query: T, privateCollection: string): Promise<T | string> {
        const key = this.getKey(query);

        const bufferData = await this.contextProvider.get(key, privateCollection);

        if (bufferData.length === 0) {
            var error = BadRequestError.throw(
                `Record Not Found with id ${key}: ${ErrorStatusCode.notFound}`, ErrorStatusCode.notFound
            );
            return error;
        }
        const document: T =
            bufferData.length !== 0 ? JSON.parse(bufferData.toString()) : null;

        return this.instanceOf(document);
    }

    public async getDataByQuery(query: string, privateCollection: string): Promise<any[] | string> {

        const data = await this.contextProvider.getByQuery(query, privateCollection);

        if (data.length === 0) {
            var error = BadRequestError.throw(
                `Record Not Found with id ${query}: ${ErrorStatusCode.notFound}`, ErrorStatusCode.notFound
            );
            return error;
        }
        return data;
    }
    /**
     * this will return mspID
     * @returns 
     */
    public getMSPID() {
        const mspID = this.contextProvider.getTxMSPID();
        return mspID;
    }

    /**
     * this will help as to get values form certificate attibute
     * @param query 
     * @returns 
     */
    public getAttributeValue(query: string) {
        return this.contextProvider.getTxAttributeValue(query);
    }
    /**
     * this fucntion will add extra values to transaction when it is going to create which are more common which should add into
     * transction before add into blockchain
     */
    public async create(data: T, privateCollection: string): Promise<T | string> {
        // throw error if wallet with this id already exists
        if (await this.exists(data)) {
            var error = BadRequestError.throw(
                `Collection data already exists with key Id: ${this.getKey(
                    data
                )}`, ErrorStatusCode.badRequest
            );
            return error;
        }

        // create wallet object
        // console.log(this.getCollection());

        const document = this.instanceOf(data);
        // document.collection = this.getCollection(); 
        // here we add extra attribute
        document.createdBy = this.contextProvider.getTxAttributeValue("userid");
        document.createdAt = this.contextProvider.getTxTimestamp();
        document.updatedAt = "";
        document.updatedBy = ""
        document.txID = this.contextProvider.getTxID();

        // put document into db
        const key = this.getKey(data);
        // here we call function to put data into blockchain
        await this.contextProvider.put(key, document.toBuffer(), privateCollection);

        return document;
    }



    /**
     * this function is add attribute only when reccord is updated
     * @param updatedData 
     * @param privateCollection 
     * @returns 
     */
    public async update(updatedData: T, privateCollection: string): Promise<T | string> {

        if (!this.contextProvider.getTxassertAttributeValue("creator", "true")) {
            var error = BadRequestError.throw(
                `Access Denied  : ${ErrorStatusCode.unAuthorized}`, ErrorStatusCode.unAuthorized
            );
            return error;
        }
        const { userId: modelId } = updatedData;
        if (modelId.length === 0) {
            var error = BadRequestError.throw("Empty identifier is Invalid", ErrorStatusCode.badRequest);
            return error;

        }


        updatedData.updatedAt = this.contextProvider.getTxTimestamp();
        updatedData.updatedBy = this.contextProvider.getTxAttributeValue("userid");
        updatedData.txID = this.contextProvider.getTxID();
        console.log("updatedData", updatedData);

        // put document into db
        const key = this.getKey(updatedData);

        await this.contextProvider.put(key, updatedData.toBuffer(), privateCollection);

        return updatedData;
    }
    public updatedAt(): string {
        return this.contextProvider.getTxTimestamp();
    }

    public updatedBy(): string {
        return this.contextProvider.getTxAttributeValue("userid");
    }

    public txID(): string {
        return this.contextProvider.getTxID();
    }
    protected instanceOf(data: T) {
        const instance = new this.type();
        instance.init(data);
        return instance;
    }

    protected getKey(data: T): string {
        return `${data.userId}`;
    }
    protected getCollection() {
        return this.constructor.name.split("Repository")[0];
    }
}
