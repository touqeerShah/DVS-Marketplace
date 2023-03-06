export class BaseError {
  private message: string
  private code: ErrorStatusCode

  constructor(message: string, code: ErrorStatusCode) {
    this.message = message
    this.code = code
  }

  throw() {
    const exception = JSON.stringify({
      message: this.message,
      code: this.code
    })
    throw new Error(exception)
    return exception;

  }

}

export enum ErrorStatusCode {
  badRequest = '400',
  unAuthorized = '401',
  forbidden = '403',
  notFound = '404',
}