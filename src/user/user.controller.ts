import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateDto } from './dto/update-userProfile';
import { UserService } from './user.service';
import { IsValidationPipe } from '../pipes/id.validation';
import { UserDecorator } from 'src/auth/strategy /decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('profile')
  @Auth()
  async getProfile(@UserDecorator('_id')_id: string){
    return this.userService.getById(_id)
  }


  @Put('profile')
  @Auth()
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  async updateProfile(
    @Body() dto: UpdateDto,
    @UserDecorator('_id')_id: string){
    return this.userService.updateProfile(_id, dto)
  }


  @Put(':id')
  @Auth('admin')
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  async updateUser(
    @Param('id' , IsValidationPipe)id: string,
    @Body() dto: UpdateDto
    ){
    return this.userService.updateProfile(id, dto)
  }

  @Delete(':id')
  @Auth('admin')
  async deleteUser(
    @Param('id' , IsValidationPipe)id: string){
    return this.userService.delete(id)
  }

  @Get()
  @Auth('admin')
  async getAll(@Query('searchTerm') searchTerm?: string){
    return this.userService.getAll(searchTerm)
  }

  @Get('count')
  @Auth('admin')
  async getCount(){
    return this.userService.getCount()
  }

  @Get(':id')
  @Auth('admin')
  async getUser(
    @Param('id' , IsValidationPipe)id: string){
    return this.userService.getById(id)
  }
}
