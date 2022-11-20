import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UsePipes, ValidationPipe, HttpCode, Query } from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IsValidationPipe } from 'src/pipes/id.validation';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}


  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string){
    return this.genreService.getAll(searchTerm)
  }


  @Get('by-slug/:slug')
  async getSlug(@Param('slug')slug : string){
    return this.genreService.bySlug(slug)
  }


  @Get('/collections')
  async getCollections(){
    return this.genreService.getCollections()
  }


  @Get(':id')
  @Auth('admin')
  async get(@Param('id' , IsValidationPipe)id: string){
    return this.genreService.byId(id)
  }

  @Post()
  @Auth('admin')
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  async create(){
    return this.genreService.create()
  }

  @Put(':id')
  @Auth('admin')
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  async update(
    @Param('id' , IsValidationPipe)id: string,
    @Body() dto: UpdateGenreDto
    ){
    return this.genreService.update(id, dto)
  }

  @Delete(':id')
  @Auth('admin')
  async delete(
    @Param('id' , IsValidationPipe)id: string){
    return this.genreService.delete(id)
  }

}
