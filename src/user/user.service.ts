import { Injectable } from '@nestjs/common';
import { UserEntity } from '@webserver/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  public constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
  }

  public async getAllUsers(): Promise<Array<UserEntity>> {
    return await this.userRepository.find();
  }
}