// result.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResultInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          message: 'Success',
          code: `FXQL-200`,
          returnStatus: 'OK',
          data: data,
        };
      }),
    );
  }
}
@Injectable()
export class GlobalErrorInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          const statusCode = error.getStatus();
          const response = error.getResponse();
          const errorMessage =
            typeof response === 'string'
              ? response
              : response?.['message'] || 'An error occurred';

          throw new HttpException(
            {
              success: false,
              message: errorMessage,
              code: `FXQL-${statusCode}`,
            },
            statusCode,
          );
        } else {
          throw new HttpException(
            {
              success: false,
              message: 'An unexpected error occurred',
              code: `FXQL-500`,
            },
            500,
          );
        }
      }),
    );
  }
}
