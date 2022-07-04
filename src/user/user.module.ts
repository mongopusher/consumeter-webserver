import { Module } from '@nestjs/common';
import { UserController } from '@webserver/user/user.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {
}