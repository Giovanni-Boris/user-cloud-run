import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { map, Observable, retry, timer } from "rxjs";
import { config } from "../configs/config";
import { HTTP_EXCEPTION_MAP } from "../constants/http-exceptions.enum";

@Injectable()
export class HttpWrapperCommon {
  private logger = new Logger(HttpWrapperCommon.name);
  private retry = config.HTTP.MAX_RETRIES;
  private delay = config.HTTP.DELAY_BETWEEN_RETRIES;

  constructor(private readonly httpService: HttpService) {}

  request<T>(requestConfig: AxiosRequestConfig): Observable<T> {
    return this.wrapperMethod<T>(this.httpService.request<T>(requestConfig));
  }

  private wrapperMethod<T>(operation: Observable<AxiosResponse<T>>): Observable<T> {
    return operation.pipe(
      retry({
        count: this.retry,
        delay: (error: AxiosError, iteration: number) => this.retryCustom(error, iteration),
        resetOnSuccess: true,
      }),
      map((data: AxiosResponse<T>) => data.data)
    );
  }

  private retryCustom(error: AxiosError, iteration: number): Observable<number> {
    const waitDuration = Math.pow(2, iteration) * this.delay;
    const retryAcceptableStatusCode = [408, 424, 429, 503, 504];
    if (!!error.response) {
      const errorJson = {
        status: error.response.statusText,
        number: error.response.status,
        body: error.response.data,
      };

      this.logErrorAndRetryCount(errorJson, iteration);

      if (retryAcceptableStatusCode.includes(error.response.status) && iteration < this.retry) {
        return timer(waitDuration);
      }

      throw new HttpException(error.response.data as Record<string, unknown>, error.response.status);
    }
    const errJson = {
      url: error.config?.url,
      code: error.code,
      message: error.message,
    };

    this.logErrorAndRetryCount(errJson, iteration);

    throw new HttpException(error.code ?? HTTP_EXCEPTION_MAP[HttpStatus.CONFLICT], HttpStatus.CONFLICT);
  }

  private logErrorAndRetryCount(data: Record<string, unknown>, iteration: number): void {
    this.logger.error(`Attempt ${iteration}: Request failed with error: ${JSON.stringify(data, null, 2)}`);

    if (iteration === this.retry - 1) {
      this.logger.error(`Maximum retries reached. Request failed with error: ${JSON.stringify(data, null, 2)}`);
    }
  }
}
