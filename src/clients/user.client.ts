import { Injectable, Logger } from "@nestjs/common";
import { HttpWrapperCommon } from "../commons/wrappers/http-wrapper.common";
import { Observable } from "rxjs";
import { config } from "../commons/configs/config";
import { ListResponseDto } from "src/models/responses/list-response.dto";
import { UserResModel } from "src/models/responses/user-res.model";
import { UserDto } from "src/models/requests/user-dto.model";
import { LoginUserDto } from "src/models/requests/user-login-dto.model";

@Injectable()
export class UserClient {
  private readonly schemaDefault = "https://";
  private readonly host = config.API.USER.HOST;
  private readonly port = `:${config.API.USER.PORT}`;
  private readonly basePath = config.API.USER.BASE_PATH;

  constructor(private readonly httpService: HttpWrapperCommon) {}

  getUsers(): Observable<ListResponseDto<UserResModel>> {
    const url = new URL(`${this.schemaDefault}${this.host}${this.port}${this.basePath}`);
    return this.httpService.request({
      url: url.toString(),
      method: "GET",
    });
  }

  saveUser(user: UserDto): Observable<UserResModel> {
    const url = new URL(`${this.schemaDefault}${this.host}${this.port}${this.basePath}`);
    return this.httpService.request({
      url: url.toString(),
      method: "POST",
      data: {
        ...user
      }
    });
  }
  loginUser(user: LoginUserDto): Observable<UserResModel> {
    const url = new URL(`${this.schemaDefault}${this.host}${this.port}${this.basePath}/login`);
    return this.httpService.request({
      url: url.toString(),
      method: "POST",
      data: {
        ...user
      }
    });
  }
}
