
import { BaseRepository } from "../core/doc-mangement/base.userVerificationRequest.repository";
import { VerificationEntity } from "./userVerificationRequest.entity";

export class userVerificationRequestRepository extends BaseRepository<VerificationEntity> {
    protected getKey(site: VerificationEntity): string {
        return `${site.userId}`;
    }

}
