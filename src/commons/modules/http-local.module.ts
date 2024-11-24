import { Module } from "@nestjs/common";
import { HttpWrapperCommon } from "../wrappers/http-wrapper.common";
import { HttpModule } from "@nestjs/axios";
import { config } from "../configs/config";
import http from "node:http";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: config.HTTP.TIMEOUT,
        maxRedirects: config.HTTP.MAX_REDIRECT,
        insecureHTTPParser: false,
        httpAgent: new http.Agent({
          keepAlive: true,
          keepAliveMsecs: 55800000,
          maxSockets: 80,
          maxFreeSockets: 5,
          timeout: config.HTTP.TIMEOUT,
          scheduling: "fifo",
        }),
      }),
    }),
  ],
  providers: [HttpWrapperCommon],
  exports: [HttpWrapperCommon],
})
export class HttpLocalModule {}
