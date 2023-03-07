import { Context } from "fabric-contract-api";
import { UserEntity } from "./user.entity";
import { userVerificationRepository } from "./user.repository";
import { UserVerificationValidators } from "./user.validator";
import { BadRequestError } from "../core/eror/bad-request-error";
import { ErrorStatusCode } from "../core/eror/base-error";
export class UserVerificationProvider {
    private userRepository: userVerificationRepository;
    private userValidators: UserVerificationValidators;

    constructor(ctx: Context) {
        this.userRepository = new userVerificationRepository(ctx, UserEntity);
        this.userValidators = new UserVerificationValidators();
    }
    /**
     * this function check comapny exist or not
     * @param userId 
     * @returns 
     */
    public async userExists(userId: string): Promise<boolean> {
        const query = {
            userId: userId,
        } as UserEntity;
        return await this.userRepository.exists(query);
    }

    /**
     * function return status of user not all details 
     * @paramtransactionId 
     * @returns 
     */
    public async getStatus(userId: string): Promise<string> {
        const query = {
            userId: userId,
        } as UserEntity;
        let mspID = this.userRepository.getMSPID();
        var response = await this.userRepository.get(query, "UserVerification" + mspID);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }
        let lotData: UserEntity = response
        return lotData.status;
    }

    /**
    * This function is  get detials of user
    * @paramtransactionId 
    * @returns 
    */
    public async getUserVerificationDetails(userId: string): Promise<boolean | string> {
        const query = {
            userId: userId,
        } as UserEntity;
        let mspID = this.userRepository.getMSPID();
        return await this.userRepository.verify(query, "UserVerification" + mspID);
    }

    /**
  * This function is  get detials of user
  * @paramtransactionId 
  * @returns 
  */
    public async VerifyUser(userId: string, fingerPrint: string): Promise<UserEntity | string> {
        const query = {
            userId: userId,
            fingerPrint: fingerPrint
        } as UserEntity;
        let mspID = this.userRepository.getMSPID();
        return await this.userRepository.get(query, "UserVerification" + mspID);
    }


    /**
     * Create user first validate the object the passed it to add more attribut and store into blockchain
     * @param user 
     * @returns 
     */
    public async createUserVerification(userId: string,
        fingerPrint: string): Promise<UserEntity | string> {
        // let location = new Location();
        let user = new UserEntity()
        user.userId = userId;
        user.fingerPrint = fingerPrint;
        user.status = "Pending"
        console.log("user", user)
        let response = await this.userValidators.createUserRecord(user);
        if (typeof response === 'string') {
            // 👇️ myVar has type string here
            return response;
        }
        let lotData: UserEntity = user
        console.log("After Validation", lotData)
        let mspID = this.userRepository.getMSPID();
        // return user;
        return await this.userRepository.create(lotData, "UserVerification" + mspID);
    }


}
