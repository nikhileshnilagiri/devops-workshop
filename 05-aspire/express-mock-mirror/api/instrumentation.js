const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
    OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");
const {
    OTLPMetricExporter,
} = require("@opentelemetry/exporter-metrics-otlp-grpc");
const { OTLPLogExporter } = require("@opentelemetry/exporter-logs-otlp-grpc");
const {
    SimpleLogRecordProcessor,
    LoggerProvider,
} = require("@opentelemetry/sdk-logs");
const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const {
    ExpressInstrumentation,
} = require("@opentelemetry/instrumentation-express");
const { credentials } = require("@grpc/grpc-js");
const { Resource } = require("@opentelemetry/resources");

const environment = process.env.NODE_ENV || "development";

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
//diag.setLogger(new DiagConsoleLogger(), environment === 'development' ? DiagLogLevel.INFO : DiagLogLevel.WARN);

const otlpServer = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;

const isHttps = otlpServer.startsWith("https://");
const collectorOptions = {
    url: otlpServer,
    credentials: !isHttps
        ? credentials.createInsecure()
        : credentials.createSsl(),
};

const resource = new Resource({
    "service.name": "p-express-mock-api-logger",
    "service.version": "1.0.0",
});

const logExporter = new OTLPLogExporter(collectorOptions);

if (otlpServer) {
    console.log(`OTLP endpoint: ${otlpServer}`);

    const sdk = new NodeSDK({
        resource: resource,
        traceExporter: new OTLPTraceExporter(collectorOptions),
        metricReader: new PeriodicExportingMetricReader({
            //exportIntervalMillis: environment === 'development' ? 5000 : 10000,
            exporter: new OTLPMetricExporter(collectorOptions),
        }),
        logRecordProcessors: [new SimpleLogRecordProcessor(logExporter)],
        instrumentations: [
            new HttpInstrumentation(),
            new ExpressInstrumentation(),
        ],
    });

    sdk.start();
}

const loggerProvider = new LoggerProvider({ resource });

loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(logExporter));

const loggerObject = loggerProvider.getLogger("testing-logger");

module.exports = { loggerObject };