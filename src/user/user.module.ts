import { Module } from '@nestjs/common';
import { UserController } from '@webserver/user/user.controller';
import { UserService } from '@webserver/user/user.service';
import { UserEntity } from '@webserver/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '@webserver/user/guards/auth.guard';
import { AdminGuard } from '@webserver/user/guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard, AdminGuard],
  exports: [UserService],
})
export class UserModule {}
