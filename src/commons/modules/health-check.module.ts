import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthCheckController } from "../../controllers/health-check.controller";

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController],
  providers: [],
})
export class HealthCheckModule {}
