import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@webserver/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@webserver/dto/createUser.dto';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@webserver/config';
import { IUserResponse } from '@webserver/types/user-response.interface';
import { TUser } from '@webserver/types/user.type';
import { LoginUserDto } from '@webserver/dto/loginUser.dto';
import { UserUtils } from '@webserver/user/user.utils';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  public async getAll(): Promise<Array<UserEntity>> {
    return await this.userRepository.find();
  }

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {

    //TODO: keine sonderzeichen im namen, nur maximal 32 zeichen lang bitte
    const userByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (userByEmail !== null || userByUsername !== null) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    console.log({ newUser });
    return await this.userRepository.save(newUser);
  }

  public async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    let user;
    if (UserUtils.isEmailAddress(loginUserDto.usernameOrEmail) === true) {
      user = await this.userRepository.findOneBy({
        email: loginUserDto.usernameOrEmail,
      });
    } else {
      user = await this.userRepository.findOneBy({
        username: loginUserDto.usernameOrEmail,
      });
    }

    if (user === null) {
      throw new HttpException(
        `User or email ${loginUserDto.usernameOrEmail} does not exist`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (isPasswordCorrect === false) {
      throw new HttpException(
        `Password for ${loginUserDto.usernameOrEmail} is wrong`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  public buildUserResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
        token: this.generateJwt(user),
      },
    };
  }

  private generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }
}
