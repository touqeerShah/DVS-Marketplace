import { Context } from "fabric-contract-api";
import { VerificationEntity } from "./userVerificationRequest.entity";
import { userVerificationRequestRepository } from "./userVerificationRequest.repository";
import { VerificationValidators } from "./userVerificationRequest.validator";
import { BadRequestError } from "../core/eror/bad-request-error";
import { ErrorStatusCode } from "../core/eror/base-error";
export class UserVerificationRequestProvider {
    private userVerificationRequestRepository: userVerificationRequestRepository;
    private verificationValidators: VerificationValidators;

    constructor(ctx: Context) {
        this.userVerificationRequestRepository = new userVerificationRequestRepository(ctx, VerificationEntity);
        this.verificationValidators = new VerificationValidators();
    }

    /**
    * This function is  get detials of user
    * @paramtransactionId 
    * @returns 
    */
    public async getVerificationDetails(userId: string): Promise<VerificationEntity | string> {
        const query = {
            userId: userId,
        } as VerificationEntity;
        let mspID = this.userVerificationRequestRepository.getMSPID();
        return await this.userVerificationRequestRepository.get(query, "VerificationEntity" + mspID);
    }




    /**
     * Create user first validate the object the passed it to add more attribut and store into blockchain
     * @param user 
     * @returns 
     */
    public async createVerificationRecord(
        userId: string,
        creator: string,
        uri: string,
        fingerPrint: string,
        signature: string,
        status: string): Promise<VerificationEntity | string> {
        // let location = new Location();
        let user = new VerificationEntity()
        user.userId = userId;
        user.creator = creator;
        user.uri = uri
        user.fingerPrint = fingerPrint
        user.signature = signature
        user.status = status

        // location.location = initLocation;
        // location.status = "activated"
        // user.shipmentLocations.push(await this.userVerificationRequestRepository.createLocationList(location)); // it will add common attribute into variable
        console.log("user", user)
        let response = await this.verificationValidators.createVerificationRecord(user);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }
        let userData: VerificationEntity = user
        console.log("After Validation", userData)
        let mspID = this.userVerificationRequestRepository.getMSPID();
        // return user;
        return await this.userVerificationRequestRepository.create(userData, "VerificationEntity" + mspID);
    }
    /**
    * update Lot  first validate the object the passed it to add more attribut and store into blockchain
    * @param user 
    * @returns 
    */
    public async updateStatus(
        userId: string, status: string,
    ): Promise<VerificationEntity | string> {
        // let location = new Location();
        var response = await this.getVerificationDetails(userId);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }

        let userData: VerificationEntity = response;
        userData.status = status;

        response = await this.verificationValidators.updateStatus(userData);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }
        let mspID = this.userVerificationRequestRepository.getMSPID();
        return await this.userVerificationRequestRepository.update(userData, "VerificationEntity" + mspID);
    }


}
