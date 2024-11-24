import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, OpenAPIObject, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { InfoObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import compression from "compression";
import { Logger } from "nestjs-pino";
import { ValidationPipe } from "@nestjs/common";
import { config, validateConfig } from "./commons/configs/config";

interface IExtendedInfoObject extends InfoObject {
  "x-business-unit-acronym"?: string;
  "x-business-acronym"?: string;
  "x-capability-acronym"?: string;
  "x-portfolio"?: string;
}

interface IExtendedOpenAPIObject extends OpenAPIObject {
  info: IExtendedInfoObject;
}

function createDocumentSwagger(app: NestFastifyApplication): void {
  const config = new DocumentBuilder()
    .setTitle("datasource")
    .setDescription("datasource to consume DATABASE")
    .setContact("Boris Ancasi", "", "")
    .setVersion("1.0")
    .addTag("datasource")
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document: IExtendedOpenAPIObject = SwaggerModule.createDocument(app, config, options);
  document.info["x-business-unit-acronym"] = "test";

  SwaggerModule.setup("api", app, document);
}

export async function bootstrap(): Promise<void> {
  validateConfig(config);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });
  app.use(compression({ threshold: 0 }));
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  createDocumentSwagger(app);
  await app.listen(config.PORT, "0.0.0.0");
}

void bootstrap();
