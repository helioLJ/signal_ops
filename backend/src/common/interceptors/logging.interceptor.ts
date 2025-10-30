import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { logs } from '@opentelemetry/api-logs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private get logger() {
    return logs.getLogger('signal-ops-backend');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const delay = Date.now() - now;
          
          this.logger.emit({
            severityText: 'INFO',
            severityNumber: 9,
            body: `${method} ${url} ${statusCode} ${delay}ms - ${ip}`,
            attributes: {
              'log.source': 'LoggingInterceptor',
              'service.name': 'signal-ops-backend',
              'http.method': method,
              'http.url': url,
              'http.status_code': statusCode,
              'http.response_time_ms': delay,
              'client.ip': ip,
            },
          });
        },
        error: (error) => {
          const delay = Date.now() - now;
          this.logger.emit({
            severityText: 'ERROR',
            severityNumber: 17,
            body: `${method} ${url} ERROR: ${error.message} ${delay}ms - ${ip}`,
            attributes: {
              'log.source': 'LoggingInterceptor',
              'service.name': 'signal-ops-backend',
              'http.method': method,
              'http.url': url,
              'http.status_code': 500,
              'http.response_time_ms': delay,
              'client.ip': ip,
              'error.message': error.message,
              'error.stack': error.stack,
            },
          });
        },
      }),
    );
  }
}

