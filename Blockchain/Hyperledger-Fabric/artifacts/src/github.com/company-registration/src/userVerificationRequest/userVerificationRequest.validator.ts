import { VerificationEntity } from "./userVerificationRequest.entity";
import * as Joi from 'joi';
import { BadRequestError } from "../core/eror/bad-request-error";
import { ErrorStatusCode } from "../core/eror/base-error";

// here we will do validation on lot creation and update to verify the data object it valid
export class VerificationValidators {
  public async createVerificationRecord(lot: VerificationEntity): Promise<VerificationEntity | string> {
    console.log("start createLot ", lot);

    const schema = Joi.object().keys({
      userId: Joi.string().required(),
      creator: Joi.array().required(),
      uri: Joi.string().required(),
      fingerPrint: Joi.string().required(),
      signature: Joi.string().required(),
      status: Joi.string().required(),
    })

    try {
      const value = await schema.validateAsync(lot)
      console.log("end createLot ", value);
      console.log("end createLot ", value);

      return value
    } catch (ex) {
      return BadRequestError.throw(`ValidationError: ${ex.message} at ${this.constructor.name}`, ErrorStatusCode.badRequest);
    }
  }
  public async updateStatus(lot: VerificationEntity): Promise<VerificationEntity | string> {
    const schema = Joi.object().keys({
      userId: Joi.string().required(),
      status: Joi.string().required(),

    })

    try {
      const value = await schema.validateAsync(lot, { allowUnknown: true })
      return value
    } catch (ex) {
      return BadRequestError.throw(`ValidationError: ${ex.message} at ${this.constructor.name}`, ErrorStatusCode.badRequest);
    }
  }
}