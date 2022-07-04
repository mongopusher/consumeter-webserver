import { Controller, Get } from '@nestjs/common';

@Controller('/user')
export class UserController {
  @Get() public getUser(): any {
    return 'someUser2';
  }
}