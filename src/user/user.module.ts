import { Module } from '@nestjs/common';
import { UserController } from '@webserver/user/user.controller';
import { UserService } from '@webserver/user/user.service';
import { UserEntity } from '@webserver/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
}