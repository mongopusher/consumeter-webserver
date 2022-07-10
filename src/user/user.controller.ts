import { Body, Controller, Get, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@webserver/user/user.service';
import { UserEntity } from '@webserver/user/user.entity';
import { CreateUserDto } from '@webserver/dto/createUser.dto';
import { IUserResponse } from '@webserver/types/user-response.interface';
import { LoginUserDto } from '@webserver/dto/loginUser.dto';

@Controller('/users')
export class UserController {
  public constructor(
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @Get()
  public async getAll(): Promise<Array<UserEntity>> {
    return await this.userService.getAll();
  }

  @Post('/create')
  @UsePipes(new ValidationPipe())
  public async create(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.create(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Post('/login')
  public async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDto);

    return this.userService.buildUserResponse(user);
  }
}
