import { 
    Controller, 
    Get, 
    Post, 
    Query, 
    Req, 
    Res, 
    Header, 
    HttpCode, 
    HttpRedirectResponse,
    Redirect,
    Inject, 
    UseFilters, 
    HttpException, 
    ParseIntPipe,
    Param,
    Body, 
    UseInterceptors,
    UsePipes,
    UseGuards
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { MemberService } from '../member/member.service';
import { UserRepository } from '../user-repository/user-repository';
import { User } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { LoginUserRequest } from 'src/model/login.model';
import { loginUserRequestValidation } from 'src/model/login.model';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';

@Controller('/api/users')
export class UserController {
    constructor(
        private service:UserService, 
        private connection:Connection,
        private mailService:MailService,
        private memberService:MemberService,
        @Inject('EmailService') private emailService:MailService,
        private userRepository:UserRepository,
    ){}
    
    @Get('/current')
    @UseGuards(new RoleGuard(['hello','operator']))
    current(@Auth() user:User):Record<string,any>{
        return {
            data:`Hello ${user.first_name} ${user.last_name}`
        }
    }

    @UsePipes(new ValidationPipe(loginUserRequestValidation))
    @UseFilters(ValidationFilter)
    @Post('/login')
    @Header('Content-Type','application/json')
    @UseInterceptors(TimeInterceptor)
    login(
        // @Body(new ValidationPipe(loginUserRequestValidation)) request :LoginUserRequest,
        @Query('name') name:string,
        @Body() request:LoginUserRequest,
    ) {
        return {
            data: `Hello ${request.username}`,
        };
    }  

    @Get('/hello')
    @UseFilters(ValidationFilter)
    async sayHello(
        @Query('first_name') firstName:string, 
        @Query('last_name') lastName:string
    ):Promise<string>{
        return  this.service.sayHello(firstName, lastName);
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
    async  create(  
        @Query('first_name') firstName:string,
        @Query('last_name') lastName:string
    ):Promise<User>{
        if(!firstName){
            throw new HttpException({
                code:400,
                errors:'first_name is required'
            },400);
        }
      return this.userRepository.save(firstName, lastName);
    }

    @Get('/:id')
    getById(@Param('id',ParseIntPipe) id:number):string{
        console.info(id * 10);
        return `GET ${id}`;
    }
}
