import { Controller, Get, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Post()
    posts():string{
        return 'POST';
    }

    @Get('/sample')
    get():string{
        return 'GET';
    }
}
