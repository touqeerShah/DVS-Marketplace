import { BaseEntity } from "../core/doc-mangement/base.entity";
// this stuct for what data field will store into blockchain
export class VerificationEntity extends BaseEntity {
    userId: string;
    creator: string;
    uri: string
    fingerPrint: string;
    status: string;
    signature: string;
}