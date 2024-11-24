import { Injectable } from "@nestjs/common";
import { ListResponseDto } from "src/models/responses/list-response.dto";
import { Observable } from "rxjs";
import { UserClient } from "src/clients/user.client";
import { UserDto } from "src/models/requests/user-dto.model";
import { UserResModel } from "src/models/responses/user-res.model";
import { LoginUserDto } from "src/models/requests/user-login-dto.model";

@Injectable()
export class UserService {
  constructor(private readonly userClient: UserClient) {}

  saveUser(user: UserDto): Observable<UserResModel> {
    return this.userClient.saveUser(user);
  }

  getUsers(): Observable<ListResponseDto<UserResModel>> {
    return this.userClient.getUsers();
  }
  loginUser(user: LoginUserDto): Observable<UserResModel> {
    return this.userClient.loginUser(user);
  }
}
