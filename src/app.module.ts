import { Module } from '@nestjs/common';
import { AppController } from '@webserver/app.controller';
import { AppService } from '@webserver/app.service';
import { UserModule } from '@webserver/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@webserver/ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
