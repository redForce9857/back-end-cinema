import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/strategy /decorators/user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('profile')
  @Auth()
  async getProfile(@User('_id')_id: string){
    return this.userService.getById(_id)
  }
}