import { Body, Controller, Post, Get } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserDto } from "src/models/requests/user-dto.model";
import { LoginUserDto } from "src/models/requests/user-login-dto.model";
import { ListResponseDto } from "src/models/responses/list-response.dto";
import { UserResModel } from "src/models/responses/user-res.model";
import { UserService } from "src/services/user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  saveUser(@Body() user: UserDto): Observable<UserResModel> {
    return this.userService.saveUser(user);
  }

  @Get()
  getUsers(): Observable<ListResponseDto<UserResModel>> {
    return this.userService.getUsers();
  }

  @Post("/login")
  loginUser(@Body() userDto: LoginUserDto): Observable<UserResModel> {
    return this.userService.loginUser(userDto);
  }
}
