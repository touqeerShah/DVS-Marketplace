import { BaseError, ErrorStatusCode } from "./base-error";

export class NotFoundError {
  public static throw(message: string) {
    const baseError = new BaseError(message, ErrorStatusCode.notFound)
    baseError.throw()
  }
}