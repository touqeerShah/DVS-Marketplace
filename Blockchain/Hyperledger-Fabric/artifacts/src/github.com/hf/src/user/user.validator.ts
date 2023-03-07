import { UserEntity } from "./user.entity";
import * as Joi from 'joi';
import { BadRequestError } from "../core/eror/bad-request-error";
import { ErrorStatusCode } from "../core/eror/base-error";

// here we will do validation on user creation and update to verify the data object it valid
export class UserVerificationValidators {
  public async createUserRecord(user: UserEntity): Promise<UserEntity | string> {
    console.log("start createLot ", user);

    const schema = Joi.object().keys({
      userId: Joi.string().required(),
      fingerPrint: Joi.string().required(),
      status: Joi.string().required(),
    })

    try {
      const value = await schema.validateAsync(user)
      console.log("end createLot ", value);
      console.log("end createLot ", value);

      return value
    } catch (ex) {
      return BadRequestError.throw(`ValidationError: ${ex.message} at ${this.constructor.name}`, ErrorStatusCode.badRequest);
    }
  }
  public async updateLotMetaData(user: UserEntity): Promise<UserEntity | string> {
    const schema = Joi.object().keys({
      lotId: Joi.string().required(),
      transactionData: Joi.array().required(),
      productId: Joi.string().required(),
      drugId: Joi.string().required(),
      lotNumber: Joi.string().required(),
      batchLotData: Joi.string().required(),
      expirationDate: Joi.string().required(),
      manufacturingDate: Joi.string().required(),
      manufacturingSite: Joi.string().required(),
      shipmentLocations: Joi.array().required(),
      recallLocations: Joi.array().required(),
      status: Joi.string().valid("deactivate", "activated", "suspended").required(),
    })

    try {
      const value = await schema.validateAsync(user, { allowUnknown: true })
      return value
    } catch (ex) {
      return BadRequestError.throw(`ValidationError: ${ex.message} at ${this.constructor.name}`, ErrorStatusCode.badRequest);
    }
  }
  public async updateLot(user: UserEntity): Promise<UserEntity | string> {
    const schema = Joi.object({
      status: Joi.string().valid("deactivate", "activated", "suspended").required()
    })

    try {
      const value = await schema.validateAsync(user, { allowUnknown: true })
      return value
    } catch (ex) {
      return BadRequestError.throw(`ValidationError: ${ex.message} at ${this.constructor.name}`, ErrorStatusCode.badRequest);
    }
  }
}