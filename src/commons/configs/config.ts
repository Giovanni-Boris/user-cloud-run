import { IAppConfig } from "../../models/interfaces/app-config.interface";

export const config: IAppConfig = {
  PORT: parseInt(process.env.PORT ?? "0", 10),
  SCHEMA_DEFAULT: process.env.SCHEMA_DEFAULT ?? "",
  HTTP: {
    DELAY_BETWEEN_RETRIES: parseInt(process.env.HTTP_DELAY_BETWEEN_RETRIES_MS ?? "0"),
    MAX_REDIRECT: parseInt(process.env.HTTP_MAX_REDIRECT ?? "0"),
    MAX_RETRIES: parseInt(process.env.HTTP_MAX_RETRY ?? "0"),
    TIMEOUT: parseInt(process.env.HTTP_TIMEOUT ?? "0"),
  },
  LOG: {
    LEVEL: process.env.LOG_LEVEL,
    SENSITIVE_DATA: process.env.LOG_SENSITIVE_DATA,
    PRETTY: process.env.LOG_PRETTY,
  },
  API: {
    USER: {
      HOST: process.env.USER_SERVICE_HOST ?? "",
      PORT: process.env.USER_SERVICE_PORT ?? "0",
      BASE_PATH: process.env.USER_SERVICE_BASE_PATH ?? "",
    },
  },
};

export function validateConfig(config: IAppConfig): void {
  function validateObject(obj: Record<string, unknown>, parentKey: string = "", ...excludedKeys: string[]): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (excludedKeys.includes(fullKey)) {
          continue;
        }

        if (typeof value === "string" && value.trim() === "") {
          throw new Error(`Application initialization failed due to missing or empty configuration: ${fullKey}`);
        }

        if (typeof value === "number" && value === 0) {
          throw new Error(`Application initialization failed due to missing or empty configuration: ${fullKey}`);
        }

        if (typeof value === "object" && value !== null) {
          validateObject(value as Record<string, unknown>, fullKey, ...excludedKeys);
        }
      }
    }
  }

  validateObject(config as unknown as Record<string, unknown>, "", "LOG");
}
