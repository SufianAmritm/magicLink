import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            map((res: unknown) => this.responseHandler(res, context)),
            catchError((err: HttpException) => throwError(() => this.errorHandler(err, context)))
        );
    }

    errorHandler(exception: HttpException, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        console.log('exception', exception);

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        response.status(status).json({
            status: false,
            statusCode: status,
            path: request.url,
            message: exception.message,
            result: exception,
        });
    }

    responseHandler(res: any, context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        if (Object.prototype.hasOwnProperty.call(res, 'error') && res.status === false) {
      return {
        status: false,
        path: request.url,
        code: res?.code,
        data: res?.data,
        message: res.message,
        error: res,
      };
    }
    let message = res?.successMessage || null;
    delete res.successMessage;
  return{
      status: true,
      path: request.url,
      code: response.statusCode,
      data: Object.keys(res).length === 0 ? null : res,
      message: message,
    };
  }
}
