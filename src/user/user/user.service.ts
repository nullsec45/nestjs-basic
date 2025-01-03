import { Injectable } from '@nestjs/common';
import { ValidationService } from '../../validation/validation/validation.service';
import {z} from 'zod';

@Injectable()
export class UserService {
    constructor(private validationService:ValidationService){

    }

    sayHello(first_name:string, last_name:string):string{
        if (!first_name) {
            throw new Error("Parameter 'first_name' is required.");
        }

         if (!last_name) {
            throw new Error("Parameter 'last_name' is required.");
        }

        const schema=z.string().min(3).max(10);
        const firstName=this.validationService.validate(schema, first_name);
        const lastName=this.validationService.validate(schema, last_name);
        return `Hello ${firstName} ${lastName}`;
    }
}
