import { Test, TestingModule } from "@nestjs/testing";
import { MicroserviceHealthIndicator, TerminusModule } from "@nestjs/terminus";
import { beforeAll, describe, vi, afterAll, it, expect } from "vitest";
import { HealthCheckController } from "../../src/controllers/health-check.controller";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { LightMyRequestResponse } from "fastify";

describe("HealthCheckController", () => {
  let app: NestFastifyApplication;
  const terminusService = {
    pingCheck: vi.fn(),
  };

  beforeAll(async () => {
    const appFixture: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthCheckController],
    })
      .overrideProvider(MicroserviceHealthIndicator)
      .useValue(terminusService)
      .compile();

    app = appFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be a healthcheck success", async () => {
    return app
      .inject({
        method: "GET",
        url: "/healthcheck",
      })
      .then((result: LightMyRequestResponse) => {
        expect(result.statusCode).toEqual(200);
        const parsedBody = JSON.parse(result.payload);
        expect(parsedBody).toEqual({
          status: "ok",
          info: {},
          error: {},
          details: {},
        });
      });
  });
});
