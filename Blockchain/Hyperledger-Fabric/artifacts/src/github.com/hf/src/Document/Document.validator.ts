import { DocumentEntity } from "./Document.entity";
import * as Joi from 'joi';
import { BadRequestError } from "../core/eror/bad-request-error";
import { ErrorStatusCode } from "../core/eror/base-error";

// here we will do validation on lot creation and update to verify the data object it valid
export class DocumentValidators {
  public async createDocument(lot: DocumentEntity): Promise<DocumentEntity | string> {

    const schema = Joi.object().keys({
      documentId: Joi.string().required(),
      documentName: Joi.string().required(),
      purpose: Joi.string().required(),
      uri: Joi.string().required(),
      startData: Joi.string().required(),
      expirationDate: Joi.string().required(),
      startBlock: Joi.string().required(),
      endBlock: Joi.string().required(),
      creator: Joi.string().required(),
      ownerSignature: Joi.string().required(),
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
  public async addSignatureDocument(lot: DocumentEntity): Promise<DocumentEntity | string> {
    const schema = Joi.object().keys({
      documentId: Joi.string().required(),
      documentName: Joi.string().required(),
      purpose: Joi.string().required(),
      uri: Joi.string().required(),
      startData: Joi.string().required(),
      expirationDate: Joi.string().required(),
      startBlock: Joi.string().required(),
      endBlock: Joi.string().required(),
      creator: Joi.string().required(),
      ownerSignature: Joi.string().required(),
      status: Joi.string().required(),
    })

    try {
      const value = await schema.validateAsync(lot, { allowUnknown: true })
      return value
    } catch (ex) {
      return BadRequestError.throw(`ValidationError: ${ex.message} at ${this.constructor.name}`, ErrorStatusCode.badRequest);
    }
  }
  public async updateLot(lot: DocumentEntity): Promise<DocumentEntity | string> {
    const schema = Joi.object({
      status: Joi.string().valid("deactivate", "activated", "suspended").required()
    })

    try {
      const value = await schema.validateAsync(lot, { allowUnknown: true })
      return value
    } catch (ex) {
      return BadRequestError.throw(`ValidationError: ${ex.message} at ${this.constructor.name}`, ErrorStatusCode.badRequest);
    }
  }
}