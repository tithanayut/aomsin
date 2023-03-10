import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from 'types';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/ldap')
  @HttpCode(200)
  ldapLogin(@Body() loginDto: LoginDto) {
    return this.authService.ldapLogin(loginDto);
  }
}
