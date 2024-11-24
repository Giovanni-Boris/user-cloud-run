import { Params } from "nestjs-pino";
import { TransportSingleOptions } from "pino";
import http from "node:http";

interface IIncomingMessage extends http.IncomingMessage {
  originalUrl: string;
}

export const loggerConfig = (): Params => {
  {
    const logLevel = process.env.LOG_LEVEL;
    const logSensitiveData = process.env.LOG_SENSITIVE_DATA;
    const pinoPretty = process.env.LOG_PRETTY;
    const nodeEnvValue: TransportSingleOptions | undefined =
      pinoPretty && pinoPretty.toLowerCase() === "true"
        ? {
            target: "pino-pretty",
            options: {
              singleLine: true,
            },
          }
        : undefined;

    return {
      pinoHttp: {
        level: logLevel ?? "info",
        autoLogging: {
          ignore: (req: IIncomingMessage): boolean => {
            return ["/healthcheck", "/api"].some((e: string) => req.originalUrl.includes(e));
          },
        },
        redact: {
          paths: logSensitiveData ? logSensitiveData.split(",") : [],
          censor: "******* Sensitive Data *******",
        },
        genReqId: (req: http.IncomingMessage): number | string | object => {
          return req.headers["x-txref"] ?? req.headers["x-txRef"] ?? {};
        },
        customProps: (): { context: string } => ({
          context: "HTTP",
        }),
        messageKey: "message",
        base: undefined,
        transport: nodeEnvValue,
        formatters: {
          level(label: string, number: number): { severity: unknown; level: number } {
            const PinoLevelToSeverityLookup: Record<string, string> = {
              trace: "DEBUG",
              debug: "DEBUG",
              info: "INFO",
              warn: "WARNING",
              error: "ERROR",
              fatal: "CRITICAL",
            };
            return {
              severity: PinoLevelToSeverityLookup[label] ?? PinoLevelToSeverityLookup.info,
              level: number,
            };
          },
        },
      },
    };
  }
};
