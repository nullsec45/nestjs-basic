import { PrismaService } from "src/prisma/prisma/prisma.service";
import { Connection } from "../connection/connection";
import { Injectable, Inject } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import {Logger} from 'winston';

@Injectable()
export class UserRepository {
    connection:Connection;
    
    constructor(
        private prismaService:PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger
    ){
        this.logger.info('User Repository');
    }

    save(first_name:string, last_name:string){
        this.logger.info(`create user with firstName ${first_name} and lastName ${last_name}`);

       return this.prismaService.user.create({
        data:{
            first_name,
            last_name
        }
       })
    }
}