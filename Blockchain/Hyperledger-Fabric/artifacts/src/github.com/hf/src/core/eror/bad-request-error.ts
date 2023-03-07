import { BaseError, ErrorStatusCode } from "./base-error";

export class BadRequestError {
  public static throw(message: string, errorCode: ErrorStatusCode) {
    const baseError = new BaseError(message, errorCode)
    return baseError.throw()
  }
}