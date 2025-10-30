import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
// Temporary: define deployment environment attribute without importing incubating entrypoint
const ATTR_DEPLOYMENT_ENVIRONMENT = 'deployment.environment' as const;

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'signal-ops-backend',
    [ATTR_SERVICE_VERSION]: '1.0.0',
    [ATTR_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  metricReader: new PrometheusExporter({
    port: 9464,
    endpoint: '/metrics',
  }),
  logRecordProcessor: new BatchLogRecordProcessor(
    new OTLPLogExporter({
      url: process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT || 'http://localhost:4318/v1/logs',
    })
  ),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false, // Disable file system instrumentation to reduce noise
      },
    }),
  ],
});

// Initialize the SDK and register with the OpenTelemetry API
sdk.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => {
      // Use console.log here since this runs before NestJS is initialized
      console.log('Tracing terminated');
    })
    .catch((error) => {
      console.log('Error terminating tracing', error);
    })
    .finally(() => process.exit(0));
});
