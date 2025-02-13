import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy{
    constructor(){
        super();
    }

    onModuleDestroy() {
        console.info('Connect Prisma');
        this.$connect();
    }

    onModuleInit() {
        console.info('Connect Prisma');
        this.$disconnect();
    }
}
