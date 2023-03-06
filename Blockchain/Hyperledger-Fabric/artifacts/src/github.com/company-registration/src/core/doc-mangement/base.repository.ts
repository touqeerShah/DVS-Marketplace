import { Context } from "fabric-contract-api";
import { Helper } from "../../utils/helper";
import { ContextProvider } from "../context/context.provider";
import { BadRequestError } from "../eror/bad-request-error";
import { NotFoundError } from "../eror/not-found-error";
import { BaseEntity } from "./base.entity";
import { ErrorStatusCode } from "./../eror/base-error"
import { CompanyEntity } from "../../company/company.entity";


export class BaseRepository<T extends CompanyEntity> {
    private contextProvider: ContextProvider;

    constructor(ctx: Context, private type: new () => T) {
        this.contextProvider = new ContextProvider(ctx);
    }

    public async exists(query: T): Promise<boolean> {
        const key = this.getKey(query);
        const mspID = this.contextProvider.getTxMSPID();
        const bufferData = await this.contextProvider.get(key, "CompanyRegistration" + mspID);
        return !!bufferData && bufferData.length > 0;
    }

    public async get(query: T, privateCollection: string): Promise<T | string> {
        const key = this.getKey(query);
        console.log("secand log -->", key);


        const bufferData = await this.contextProvider.get(key, privateCollection);
        console.log("secand log -->", bufferData.toString());

        if (bufferData.length === 0) {
            let error = BadRequestError.throw(
                `Record Not Found with id ${key}: ${ErrorStatusCode.notFound}`, ErrorStatusCode.notFound
            );
            return error;
        }
        const document: T =
            bufferData.length !== 0 ? JSON.parse(bufferData.toString()) : null;

        return this.instanceOf(document);
    }

    public getMSPID() {
        const mspID = this.contextProvider.getTxMSPID();
        return mspID;
    }
    public async getByQuery(query: string) {
        const mspID = this.contextProvider.getTxMSPID();
        return await this.contextProvider.getByQuery(query, "CompanyRegistration" + mspID);
    }

    public async getAttributeValue(query: string) {
        return this.contextProvider.getTxAttributeValue(query);
    }

    public async create(data: T, privateCollection: string): Promise<T | string> {
        // throw error if wallet with this id already exists
        if (!this.contextProvider.getTxassertAttributeValue("creator", "true")) {
            var error = BadRequestError.throw(
                `Access Denied  : ${ErrorStatusCode.unAuthorized}`, ErrorStatusCode.unAuthorized
            );
            return error;

        }
        if (await this.exists(data)) {
            var error = BadRequestError.throw(
                `Collection data already exists with key Id: ${this.getKey(
                    data
                )}`, ErrorStatusCode.badRequest
            );
            return error;

        }

        // create wallet object
        console.log("privateCollection", privateCollection);

        const document = this.instanceOf(data);
        // document.collection = this.getCollection();
        document.createdBy = this.contextProvider.getTxAttributeValue("userid");
        document.createdAt = this.contextProvider.getTxTimestamp();
        document.updatedAt = this.contextProvider.getTxTimestamp();
        document.updatedBy = ""
        document.txID = this.contextProvider.getTxID();
        // document.companyId = document.companyId;
        // put document into db
        const key = document.companyId;

        await this.contextProvider.put(key, document.toBuffer(), privateCollection);

        return document;
    }

    public async update(updatedData: T, privateCollection: string): Promise<T | string> {

        if (!this.contextProvider.getTxassertAttributeValue("creator", "true")) {
            let error = BadRequestError.throw(
                `Access Denied  : ${ErrorStatusCode.unAuthorized}`, ErrorStatusCode.unAuthorized
            );
            return error
        }
        const { companyId: modelId } = updatedData;
        if (modelId.length === 0) {
            BadRequestError.throw("Empty identifier is Invalid", ErrorStatusCode.badRequest);
        }

        // throw error if data with this id does not exist
        const document = await this.get(updatedData, privateCollection);
        if (typeof document === 'string') {
            // 👇️ myVar has type string here
            return document;
        }
        if (!document) {
            NotFoundError.throw(
                `Document with Id: ${this.getKey(updatedData)} does not exist`
            );
        }

        // create data collection
        document.init(updatedData);
        document.updatedAt = this.contextProvider.getTxTimestamp();
        document.updatedBy = this.contextProvider.getTxAttributeValue("userid");
        document.txID = this.contextProvider.getTxID();

        // put document into db
        const key = this.getKey(updatedData);
        const mspID = this.contextProvider.getTxMSPID();

        await this.contextProvider.put(key, document.toBuffer(), privateCollection);

        return document;
    }



    protected instanceOf(data: T) {
        const instance = new this.type();
        instance.init(data);
        return instance;
    }

    protected getKey(data: T): string {
        return `${data.companyId}`;
    }
    protected getCollection() {
        return this.constructor.name.split("Repository")[0];
    }
}
