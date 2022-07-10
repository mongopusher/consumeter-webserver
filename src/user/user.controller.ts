import { Body, Controller, Get, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@webserver/user/user.service';
import { UserEntity } from '@webserver/user/user.entity';
import { CreateUserDto } from '@webserver/dto/createUser.dto';
import { IUserResponse } from '@webserver/types/user-response.interface';

@Controller('')
export class UserController {
  public constructor(
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @Get('/users')
  public async getUser(): Promise<Array<UserEntity>> {
    return await this.userService.getAllUsers();
  }

  @Post('/create-user')
  @UsePipes(new ValidationPipe())
  public async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildCreateUserResponse(user);
  }
}
