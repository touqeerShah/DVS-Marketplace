import { Context } from "fabric-contract-api";
import { Helper } from "../../utils/helper";

export class ContextProvider {
    private ctx: Context;

    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    public async get(key: string, privateCollection?: string): Promise<Uint8Array> {
        return await this.ctx.stub.getPrivateData(privateCollection, key);
    }

    public async getByQuery(query: string, privateCollection?: string): Promise<any[]> {
        console.log("before ===>", query);

        const queryString = JSON.stringify(query);
        console.log("queryString ===>", queryString, "=== ", privateCollection);

        let queryResult: any = await this.ctx.stub.getPrivateDataQueryResult(privateCollection, queryString);
        // Promise<Iterators.StateQueryIterator> & AsyncIterable<Iterators.KV> 
        //  Promise<Iterators.StateQueryIterator> & AsyncIterable<Iterators.KV>

        // queryResult = await this.ctx.stub.getQueryResult('{"selector":{"_id":{"$regex":""}}}');
        // console.log("queryResult  = ", queryResult);

        // console.log("queryResult  = ", queryResult.iterator.next());
        // console.log("queryResult  = ", await this.GetAllResults(queryResult, false));

        return Helper.convertIteratorToArray(queryResult.iterator);
    }

    public async put(key, buffer: Buffer, privateCollection?: string): Promise<void> {
        await this.ctx.stub.putPrivateData(privateCollection, key, buffer);
    }

    // public async delete(key,privateCollection?:string): Promise<void> {
    //     await this.ctx.stub.deletePrivateData("UserOrg1MSP",key);
    // }

    public getTxCommonName(): string {
        return this.ctx.clientIdentity.getID();
    }
    public getTxAttributeValue(attributeName: string): string {
        return this.ctx.clientIdentity.getAttributeValue(attributeName);
    }
    public getTxassertAttributeValue(attributeName: string, value: any): boolean {
        return this.ctx.clientIdentity.assertAttributeValue(attributeName, value);
    }
    public getTxMSPID(): string {
        return this.ctx.clientIdentity.getMSPID();
    }

    public getTxTimestamp(): any {
        const { seconds, nanos } = this.ctx.stub.getTxTimestamp();
        // if (typeof seconds == "number" || typeof seconds == "bigint")
        return (seconds * 1000 + nanos / 1000000).toString();
        // else
        // return "0"
    }

    public getTxID(): string {
        return this.ctx.stub.getTxID();
    }
    public async raiseEvent(eventName: string, data: object): Promise<void> {
        const buffer = Buffer.from(JSON.stringify(data));
        this.ctx.stub.setEvent(eventName, buffer);
    }
}
