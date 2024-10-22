import { Controller, Get, Post, Query, Req, Res, Header, HttpCode, HttpRedirectResponse, Redirect } from '@nestjs/common';
import { Request, Response } from 'express';


@Controller('/api/users')
export class UserController {
    @Get('/hello')
    sayHello(@Query('first_name') firstName:string, @Query('last_name') lastName:string):string{
        return `Hello ${firstName} ${lastName}`;
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


    @Get('/:id')
    getById(@Req() request :Request):string{
        return `GET ${request.params.id};`
    }
}
