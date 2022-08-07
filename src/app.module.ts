import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@webserver/app.controller';
import { AppService } from '@webserver/app.service';
import { UserModule } from '@webserver/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@webserver/ormconfig';
import { AuthMiddleware } from '@webserver/user/middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
