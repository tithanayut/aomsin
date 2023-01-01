import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/graphql', 301)
  getHello(): string {
    return 'Hello World!';
  }
}
