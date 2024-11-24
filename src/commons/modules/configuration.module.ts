import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { loggerConfig } from "../configs/logger.config";

@Module({
  imports: [LoggerModule.forRoot(loggerConfig())],
})
export class ConfigurationModule {}
