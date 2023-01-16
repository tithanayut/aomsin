import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/common/guards/jwt.guard';
import { AuthUser } from 'types';

import { UserService } from './user.service';

@Resolver('User')
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('me')
  me(@CurrentUser() user: AuthUser) {
    return this.userService.findOne(user.id);
  }
}
