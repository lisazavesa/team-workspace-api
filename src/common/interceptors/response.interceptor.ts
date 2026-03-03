import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        
        return next.handle().pipe(
            map((data) => {
                let responseData = data;
                let meta;

                if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
                    responseData = data.data;
                    meta = data.meta;
                }

                return {
                    success: true,
                    data: responseData,
                    ...(meta && { meta }),
                    timestamp: new Date().toISOString(),
                    path: request.url,
                };
            }),
        );
    }
}