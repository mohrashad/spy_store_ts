import { Post, Body, JsonController, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { SignupDto, LoginDto } from './dtos';
import { AuthService } from './auth.service';

@Service()
@JsonController('/auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signupDto: SignupDto): Promise<{}> {
    return this.authService.signup(signupDto);
  }
  
  @Post('/login')
  logIn(@Body() loginDto: LoginDto): Promise<{}> {
    return this.authService.login(loginDto);
  }
}
