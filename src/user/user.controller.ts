import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from '@webserver/user/user.service';
import { UserEntity } from '@webserver/user/user.entity';

@Controller('/user')
export class UserController {
  public constructor(@Inject(UserService) private readonly userService: UserService) {
  }

  @Get()
  public async getUser(): Promise<Array<UserEntity>> {
    return await this.userService.getAllUsers();
  }
}