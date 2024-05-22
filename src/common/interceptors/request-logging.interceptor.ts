import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, originalUrl, origin } = request;

    Logger.log('Method', method);
    Logger.log('URL', url);
    Logger.log('Query', query);
    Logger.log('Original URL', originalUrl);
    Logger.log('Origin', origin);

    return next.handle();
  }
}
