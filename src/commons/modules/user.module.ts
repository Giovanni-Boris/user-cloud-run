import { Module } from "@nestjs/common";
import { HttpLocalModule } from "./http-local.module";
import { UserService } from "src/services/user.service";
import { UserClient } from "src/clients/user.client";
import { UserController } from "src/controllers/user.controller";

@Module({
  imports: [HttpLocalModule],
  providers: [UserService, UserClient],
  controllers: [UserController],
})
export class UserModule {}
