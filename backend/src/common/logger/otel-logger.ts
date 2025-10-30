import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { logs } from '@opentelemetry/api-logs';

@Injectable()
export class OtelLogger implements LoggerService {
  private get logger() {
    return logs.getLogger('signal-ops-backend');
  }

  log(message: any, context?: string) {
    this.logger.emit({
      severityText: 'INFO',
      severityNumber: 9,
      body: typeof message === 'string' ? message : JSON.stringify(message),
      attributes: {
        'log.source': context || 'application',
        'service.name': 'signal-ops-backend',
      },
    });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.emit({
      severityText: 'ERROR',
      severityNumber: 17,
      body: typeof message === 'string' ? message : JSON.stringify(message),
      attributes: {
        'log.source': context || 'application',
        'service.name': 'signal-ops-backend',
        'error.stack': trace,
      },
    });
  }

  warn(message: any, context?: string) {
    this.logger.emit({
      severityText: 'WARN',
      severityNumber: 13,
      body: typeof message === 'string' ? message : JSON.stringify(message),
      attributes: {
        'log.source': context || 'application',
        'service.name': 'signal-ops-backend',
      },
    });
  }

  debug(message: any, context?: string) {
    this.logger.emit({
      severityText: 'DEBUG',
      severityNumber: 5,
      body: typeof message === 'string' ? message : JSON.stringify(message),
      attributes: {
        'log.source': context || 'application',
        'service.name': 'signal-ops-backend',
      },
    });
  }

  verbose(message: any, context?: string) {
    this.logger.emit({
      severityText: 'VERBOSE',
      severityNumber: 1,
      body: typeof message === 'string' ? message : JSON.stringify(message),
      attributes: {
        'log.source': context || 'application',
        'service.name': 'signal-ops-backend',
      },
    });
  }

  setLogLevels(levels: LogLevel[]) {
    // OpenTelemetry doesn't have log levels in the same way
    // This is a no-op for compatibility
  }
}
