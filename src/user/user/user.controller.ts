import { Controller, Get, Post, Query, Req, Res, Header, HttpCode, HttpRedirectResponse, Redirect, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { MemberService } from '../member/member.service';
import { UserRepository } from '../user-repository/user-repository';
import { User } from '@prisma/client';


@Controller('/api/users')
export class UserController {
    constructor(
        private service:UserService, 
        private connection:Connection,
        private mailService:MailService,
        private memberService:MemberService,
        @Inject('EmailService') private emailService:MailService,
        private userRepository:UserRepository
    ){}

    @Get('/hello')
    async sayHello(@Query('first_name') firstName:string, @Query('last_name') lastName:string):Promise<string>{
        return  this.service.sayHello(firstName);
    }

    @Post()
    posts():string{
        return 'POST';
    }

    @Get('/sample')
    get():string{
        return 'GET';
    }

    @Get('/sample-response')
    sampleResponse(@Res() response:Response){
        response.status(200).send('Sample Response');
    }

    @Get('/sample-response-json')
    @Header('Content-Type','application/json')
    @HttpCode(200)
    sampleResponseJSON():Record<string,string>{
        return {
            data : 'Hello JSON'
        }
    }

    @Get('/redirect')
    @Redirect()
    redirect():HttpRedirectResponse{
        return {
            url:'/api/users/sample-response',
            statusCode:301
        }
    }

    @Get('/set-cookie')
    setCokie(@Query('name') name:string, @Res() response: Response){
        response.cookie('name', name);
        response.status(200).send('Success Set Cookie');
    }

    @Get('/get-cookie')
    getCookie(@Req() request:Request):string{
        return request.cookies['name'];
    }

    @Get('/view/hello')
    viewHellO(@Query('name') name:string, @Res() response:Response){
        response.render('index.html',{
            title:'Template Engine',
            name
        })
    }

    @Get('/connection')
    async getConnection():Promise<string> {
        this.mailService.send();
        this.emailService.send();

        console.info(this.memberService.getConnectionName());
        this.memberService.sendEmail();

        return this.connection.getName();
    }

    @Get('/create')
    async  create(  @Query('first_name') firstName:string,
        @Query('last_name') lastName:string
    ):Promise<User>{
      return this.userRepository.save(firstName, lastName);
    }

    @Get('/:id')
    getById(@Req() request :Request):string{
        return `GET ${request.params.id};`
    }
}
