import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@webserver/user/user.entity';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@webserver/user/dto/createUser.dto';
import { sign } from 'jsonwebtoken';
import { IUserResponse } from '@webserver/user/types/user-response.interface';
import { LoginUserDto } from '@webserver/user/dto/loginUser.dto';
import { UserUtils } from '@webserver/user/user.utils';
import { compare } from 'bcrypt';
import { UpdateUserDto } from '@webserver/user/dto/updateUser.dto';
import * as fs from 'fs';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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
    return await this.userRepository.save(newUser);
  }

  public async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    let user;
    if (UserUtils.isEmailAddress(loginUserDto.usernameOrEmail) === true) {
      user = await this.userRepository.findOne({
        select: ['id', 'email', 'username', 'password'],
        where: {
          email: loginUserDto.usernameOrEmail,
        },
      });
    } else {
      user = await this.userRepository.findOne({
        select: ['id', 'email', 'username', 'password'],
        where: {
          username: loginUserDto.usernameOrEmail,
        },
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

  public async updateUser(
    currentUserId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.getById(currentUserId, true);

    const username = updateUserDto.username ?? user.username;
    const email = updateUserDto.email ?? user.email;

    if (updateUserDto.username !== undefined) {
      const possibleDuplicateByUsername = await this.userRepository.findOneBy({
        id: Not(currentUserId),
        username,
      });

      if (possibleDuplicateByUsername !== null) {
        throw new HttpException(
          'Username is already taken!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateUserDto.email !== undefined) {
      const possibleDuplicateByEmail = await this.userRepository.findOneBy({
        id: Not(currentUserId),
        email,
      });
      if (possibleDuplicateByEmail !== null) {
        throw new HttpException(
          'Email is already taken!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const isPasswordCorrect = await compare(
      updateUserDto.password,
      user.password,
    );

    if (isPasswordCorrect === false) {
      throw new HttpException(`Password is wrong`, HttpStatus.UNAUTHORIZED);
    }

    Object.assign(user, { email, username });
    const updateResult = await this.userRepository.update(
      { id: currentUserId },
      { username, email },
    );
    if (updateResult.affected !== 1) {
      console.error(
        'Always should be 1 row on updateUser! Actual affected: ',
        updateResult.affected,
      );
    }

    return await this.getById(currentUserId);
  }

  public async getById(
    id: number,
    withPassword = false,
  ): Promise<UserEntity | null> {
    if (id === undefined || id === null) {
      return null;
    }

    const searchOptions: FindOneOptions = withPassword
      ? { where: { id }, select: ['username', 'password', 'email'] }
      : { where: { id } };

    return await this.userRepository.findOne(searchOptions);
  }

  public async buildUserResponse(user: UserEntity): Promise<IUserResponse> {
    const token = await this.generateJwt(user);
    return {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
        token,
        expiresIn: 86400,
      },
    };
  }

  private async generateJwt(user: UserEntity): Promise<string> {
    let RS256Secret;
    try {
      RS256Secret = await fs.promises.readFile('./resources/private.key');
    } catch (e) {
      console.error('Error while reading rs256 secret: ', e);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      RS256Secret,
      {
        algorithm: 'RS256',
        expiresIn: '1d',
      },
    );
  }
}
