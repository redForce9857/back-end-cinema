import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Type, HttpCode, Put, ValidationPipe, UsePipes } from '@nestjs/common';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';
import { IsValidationPipe } from 'src/pipes/id.validation';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async getSlug(@Param('slug')slug : string){
    return this.movieService.getBySlug(slug)
  }

  @Get('by-actor/:actorId')
  async getActorId(@Param('actorId', IsValidationPipe )actorId : Types.ObjectId){
    return this.movieService.getByActor(actorId)
  }

  @UsePipes(new ValidationPipe)
  @Post('by-genres')
  @HttpCode(200)
  async byGenre(@Body("genreId") genreId: Types.ObjectId[]){
    return this.movieService.getByGenres(genreId)
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string){
    return this.movieService.getAll(searchTerm)
  }


  @Get('most-popular')
  async getMostPopular(){
    return this.movieService.getMostPopular()
  }

  @Put('update-count-opened')
  @HttpCode(200)
  async updateCountOpened(@Body('slug') slug: string ){
    return this.movieService.updateCountOpened(slug)
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id' , IsValidationPipe)id: string){
    return this.movieService.getById(id)
  }

  @Post()
  @Auth('admin')
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  async create(){
    return this.movieService.create()
  }

  @Put(':id')
  @Auth('admin')
  @UsePipes(new ValidationPipe)
  @HttpCode(200)
  async update(
    @Param('id' , IsValidationPipe)id: string,
    @Body() dto: UpdateMovieDto
    ){
    return this.movieService.update(id, dto)
  }

  @Delete(':id')
  @Auth('admin')
  async delete(
    @Param('id' , IsValidationPipe)id: string){
    return this.movieService.delete(id)
  }
}
