import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import { ValidationModule } from './validation/validation.module';
import * as winston from 'winston';
import { APP_GUARD, MiddlewareBuilder } from '@nestjs/core';
import { LogMiddleware } from './log/log.middleware';
import { AuthMiddleware } from './auth/auth.middleware';
import { RoleGuard } from './role/role.guard';

@Module({
  imports: [
    WinstonModule.forRoot({
        format:winston.format.json(),
        level:'debug',
        transports:[new winston.transports.Console()]
    }),
    ConfigModule.forRoot({
      isGlobal:true
    }),
    UserModule,
    PrismaModule,
    ValidationModule.forRoot(true),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide:APP_GUARD,
      useClass:RoleGuard
    }
  ],
})
export class AppModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(LogMiddleware).forRoutes({
      path:'/api/*',
      method:RequestMethod.ALL
    });

    consumer.apply(AuthMiddleware).forRoutes({
      path:'/api/users/current',
      method:RequestMethod.ALL
    });
  }
}
