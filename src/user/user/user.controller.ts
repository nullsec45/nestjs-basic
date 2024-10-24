import { Controller, Get, Post, Query, Req, Res, Header, HttpCode, HttpRedirectResponse, Redirect } from '@nestjs/common';
import { Request, Response } from 'express';
import { request } from 'http';


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

    @Get('/set-cookie')
    setCokie(@Query('name') name:string, @Res() response: Response){
        response.cookie('name', name);
        response.status(200).send('Success Set Cookie');
    }

    @Get('/get-cookie')
    getCookie(@Req() request:Request):string{
        return request.cookies['name'];
    }

    @Get('/:id')
    getById(@Req() request :Request):string{
        return `GET ${request.params.id};`
    }

    @Get('/view/hello')
    viewHellO(@Query('name') name:string, @Res() response:Response){
        response.render('index.html',{
            title:'template Engine',
            name
        })
    }
}
