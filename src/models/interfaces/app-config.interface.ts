export interface ILoggerConfig {
  LEVEL?: string;
  SENSITIVE_DATA?: string;
  PRETTY?: string;
}

export interface IHttpConfig {
  TIMEOUT: number;
  MAX_REDIRECT: number;
  MAX_RETRIES: number;
  DELAY_BETWEEN_RETRIES: number;
}



export interface IApisProperties {
  HOST: string;
  PORT: string;
  BASE_PATH: string;
}

export interface IAPIConfig {
  USER: IApisProperties;
}

export interface IAppConfig {
  SCHEMA_DEFAULT: string;
  PORT: number;
  HTTP: IHttpConfig;
  API: IAPIConfig;
  LOG?: ILoggerConfig;
}
