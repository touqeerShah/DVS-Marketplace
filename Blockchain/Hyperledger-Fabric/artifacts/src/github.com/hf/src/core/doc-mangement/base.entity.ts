// this are class for extra attribute
export class BaseEntity {
    public createdBy: string;
    public updatedBy: string;
    public updatedAt: any;
    public createdAt: any;
    public txID: string;

    public toString() {
        return JSON.stringify(this);
    }

    public toBuffer(encoding: BufferEncoding = "utf8") {
        return Buffer.from(this.toString(), encoding);
    }

    public init(data: IBase) {
        for (const prop of Object.keys(data)) {
            this[prop] = data[prop];
        }
    }
}

interface IBase {
    createdAt: string;
    createdBy: string;
    updatedBy: string;
    updatedAt: string;
    txID: string;
}
