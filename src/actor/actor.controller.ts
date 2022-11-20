import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe, UsePipes, HttpCode, Put } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IsValidationPipe } from 'src/pipes/id.validation';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

@Controller('actor')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string){
    return this.actorService.getAll(searchTerm)
  }


  @Get('by-slug/:slug')
  async getSlug(@Param('slug')slug : string){
    return this.actorService.getSlug(slug)
  }


  @Get(':id')
  @Auth('admin')
  async get(@Param('id' , IsValidationPipe)id: string){
    return this.actorService.getById(id)
  }

  @Post()
  @Auth('admin')
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  async create(){
    return this.actorService.create()
  }

  @Put(':id')
  @Auth('admin')
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  async update(
    @Param('id' , IsValidationPipe)id: string,
    @Body() dto: UpdateActorDto
    ){
    return this.actorService.update(id, dto)
  }

  @Delete(':id')
  @Auth('admin')
  async delete(
    @Param('id' , IsValidationPipe)id: string){
    return this.actorService.delete(id)
  }
}
