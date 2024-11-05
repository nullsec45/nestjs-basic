import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, MongoDBConnection, MySQLConnection } from './connection/connection';
import { mailService, MailService } from './mail/mail.service';
import { MemberService } from './member/member.service';
import { createUserRepository, UserRepository } from './user-repository/user-repository';
import { ConfigService } from '@nestjs/config';
import { createConnection } from './connection/connection';

@Module({
  controllers: [UserController],
  providers: [
    UserService, 
    {
      provide:Connection,
      useFactory: createConnection,
      inject:[ConfigService]
    },
    {
      provide:MailService,
      useValue:mailService
    },
    MemberService,
    {
      provide:UserRepository,
      useFactory:createUserRepository,
      inject:[Connection]
    },
    {
      provide:'EmailService',
      useExisting:MailService
    }
  ],
  exports:[UserService]
})
export class UserModule {}
