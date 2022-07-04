import { Module } from '@nestjs/common';
import { AppController } from '@webserver/app.controller';
import { AppService } from '@webserver/app.service';
import { UserModule } from '@webserver/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
