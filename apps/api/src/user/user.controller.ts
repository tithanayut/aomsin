import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'types';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createLocalUser(createUserDto);
  }
}
