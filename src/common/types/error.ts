import { ErrorInterface } from '../interfaces/error.interface';

export class CustomError extends Error {
  public code: number;

  constructor(message: string, code?: number) {
    super(message);
    this.code = code;
  }
}

export class ErrorModel implements ErrorInterface {
  status: boolean;
  message: string;
  error?: Error;
  name?: string;
  data: any;
  code: number;

  constructor(
    status: boolean,
    message: string,
    data?: any,
    code?: number,
    error?: Error,
  ) {
    this.status = status;
    this.message = message;
    this.error = error;
    this.name = 'Error';
    this.data = data;
    this.code = code;
  }
}

export class ValidationFailedErrorModel extends ErrorModel {
  constructor(message: string, error?: Error) {
    super(false, message, error);
    this.name = 'Bad Request Error';
  }
}

export class UnAuthorizedErrorModel extends ErrorModel {
  constructor(message: string, error?: Error) {
    super(false, message, error);
    this.name = 'Not Authorized Error';
  }
}

export class ForbiddenErrorModel extends ErrorModel {
  constructor(message: string, error?: Error) {
    super(false, message, error);
    this.name = 'Not Allowed Error';
  }
}

export class ResourceNotFoundErrorModel extends ErrorModel {
  constructor(message: string, error?: Error) {
    super(false, message, error);
    this.name = 'Not Found Error';
  }
}

export class ResourceAlreadyExistsErrorModel extends ErrorModel {
  constructor(message: string, error?: Error) {
    super(false, message, error);
    this.name = 'Already Exists Error';
  }
}

export class InternalServerErrorModel extends ErrorModel {
  constructor(message: string, error?: Error) {
    super(false, message, error);
    this.name = 'Server Error';
  }
}

export class HandledErrorModel extends ErrorModel {
  constructor(
    message: string,
    data: any = null,
    code: number = 400,
    error?: Error,
  ) {
    super(false, message, data, code, error);
    this.name = 'Handle Error';
  }
}
