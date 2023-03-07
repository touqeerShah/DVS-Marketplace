import { BaseEntity } from "../core/doc-mangement/base.entity";
// this stuct for what data field will store into blockchain


export class UserEntity extends BaseEntity {
    userId: string;
    fingerPrint: string;
    status: string;
}

