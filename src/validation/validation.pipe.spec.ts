import { ValidationPipe } from './validation.pipe';
import { loginUserRequestValidation } from 'src/model/login.model';

describe('ValidationPipe', () => {
  it('should be defined', () => {
    expect(new ValidationPipe(loginUserRequestValidation)).toBeDefined();
  });
});
