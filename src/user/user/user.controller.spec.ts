import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMock from 'node-mocks-http';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers:[UserService]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should can say hello', async () => {
    const response=await controller.sayHello('Fajar','Rama');
    expect(response).toBe('Hello Fajar');
  });

  it('should can view template', async() => {
    const response=httpMock.createResponse();
    controller.viewHellO('Fajar', response);

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      name:'Fajar',
      title:'Template Engine'
    });
  });
});
