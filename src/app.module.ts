import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./commons/modules/configuration.module";
import { HealthCheckModule } from "./commons/modules/health-check.module";
import { UserModule } from "./commons/modules/user.module";
import { HttpLocalModule } from "./commons/modules/http-local.module";

@Module({
  imports: [ConfigurationModule, HealthCheckModule, UserModule, HttpLocalModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
