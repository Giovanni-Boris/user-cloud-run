import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { AbstractHttpAdapter, HttpAdapterHost } from "@nestjs/core";
import { HTTP_EXCEPTION_MAP } from "../constants/http-exceptions.enum";

@Catch()
export class ExceptionHandlerCommon implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter }: { httpAdapter: AbstractHttpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const request = ctx.getRequest<Request>();

      const responseBody = {
        statusCode: exception.getStatus(),
        status: HTTP_EXCEPTION_MAP[exception.getStatus()],
        path: httpAdapter.getRequestUrl(request) as string,
        timestamp: new Date().toISOString(),
        reason: "",
      };

      if (typeof response === "object" && response !== null) {
        if ("message" in response) {
          responseBody.reason = response.message as string;
        } else if ("reason" in response) {
          responseBody.reason = response.reason as string;
        } else {
          responseBody.reason = JSON.stringify(response);
        }
      } else {
        responseBody.reason = exception.message;
      }

      httpAdapter.reply(ctx.getResponse(), responseBody, exception.getStatus());
    }
  }
}
