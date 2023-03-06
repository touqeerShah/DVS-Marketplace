
import { BaseRepository } from "../core/doc-mangement/base.user.repository";
import { UserEntity } from "./user.entity";

export class userVerificationRepository extends BaseRepository<UserEntity> {
    protected getKey(site: UserEntity): string {
        return `${site.userId}`;
    }

}
