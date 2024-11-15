import { PrismaService } from "src/prisma/prisma/prisma.service";
import { Connection } from "../connection/connection";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
    connection:Connection;
    
    constructor(private prismaService:PrismaService){

    }

    save(first_name:string, last_name:string){
       return this.prismaService.user.create({
        data:{
            first_name,
            last_name
        }
       })
    }
}