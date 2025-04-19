const { loggerObject } = require("./instrumentation");
const { SeverityNumber } = require("@opentelemetry/api-logs");

class Logger {
    info(payload) {
        loggerObject?.emit({
            severityNumber: SeverityNumber.INFO,
            severityText: "INFO",
            body: payload,
        });
    }

    error(payload) {
        loggerObject?.emit({
            severityNumber: SeverityNumber.ERROR,
            severityText: "ERROR",
            body: payload,
        });
    }

    debug(payload) {
        loggerObject?.emit({
            severityNumber: SeverityNumber.DEBUG,
            severityText: "DEBUG",
            body: payload,
        });
    }
}

module.exports = { Logger };
