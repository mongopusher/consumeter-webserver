import { Body, Controller, Get, Inject, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@webserver/user/user.service';
import { UserEntity } from '@webserver/user/user.entity';
import { CreateUserDto } from '@webserver/user/dto/createUser.dto';
import { IUserResponse } from '@webserver/user/types/user-response.interface';
import { LoginUserDto } from '@webserver/user/dto/loginUser.dto';
import { IExpressRequest } from '@webserver/types/express-request.interface';
import { UpdateUserDto } from '@webserver/user/dto/updateUser.dto';
import { User } from '@webserver/user/decorators/user.decorator';
import { AuthGuard } from '@webserver/user/guards/auth.guard';
import { AdminGuard } from '@webserver/user/guards/admin.guard';

@Controller('')
export class UserController {
  public constructor(
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @Get('/users')
  @UseGuards(AdminGuard)
  public async getAll(): Promise<Array<UserEntity>> {
    return await this.userService.getAll();
  }

  @Post('/create-user')
  @UsePipes(new ValidationPipe())
  public async create(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.create(createUserDto);

    return await this.userService.buildUserResponse(user);
  }

  @Post('/login')
  public async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDto);

    return await this.userService.buildUserResponse(user);
  }

  @Put('/update-user')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  public async updateUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @User('id') userId: number,
  ): Promise<IUserResponse> {
    const user = await this.userService.updateUser(userId, updateUserDto);

    return await this.userService.buildUserResponse(user);
  }

  @Get('/user')
  @UseGuards(AuthGuard)
  public async getCurrentUser(
    @User() user: UserEntity,
  ): Promise<IUserResponse> {
    return await this.userService.buildUserResponse(user);
  }
}
