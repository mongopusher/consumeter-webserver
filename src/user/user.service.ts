import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@webserver/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@webserver/dto/createUser.dto';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@webserver/config';
import { IUserResponse } from '@webserver/types/user-response.interface';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  public async getAllUsers(): Promise<Array<UserEntity>> {
    return await this.userRepository.find();
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
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

  public buildCreateUserResponse(user: UserEntity): IUserResponse {
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
