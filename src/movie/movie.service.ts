import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Types } from 'mongoose';
import { Movie } from './model/movie.model';

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie) private MovieModel: ModelType<Movie>){}

  async getMostPopular(){
    return await this.MovieModel
    .find({countOpened: {$gt: 0}})
    .sort({countOpened: -1})
    .populate("genres")
    .exec()
  }

  async getAll(searchTerm?: string){
    let option = {}

    if(searchTerm){
      option = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }

    return this.MovieModel.find(option)
    .select('-updatedAt -__v')
    .sort({
      createdAt: 'desc'
    })
    .populate("actors genres")
    .exec()
  }

  async getBySlug(slug:string){
    const docSlug = await this.MovieModel.findOne({slug}).populate("actors genres").exec()
    if(!docSlug) throw new NotFoundException('slug not found')

    return docSlug;
  }

  async getByActor(actorId:Types.ObjectId){
    const actor = await this.MovieModel.find({actors: actorId}).exec()
    if(!actor) throw new NotFoundException('movies by this actor not found')

    return actor;
  }

  async getByGenres(genreIds: Types.ObjectId[]){
    const genre = await this.MovieModel.find({genres: {$in: genreIds}}).exec()
    if(!genre) throw new NotFoundException('slug not found')

    return genre;
  }

  async updateCountOpened(slug: string){
    const updateCountOpened = await this.MovieModel.findOneAndUpdate({slug},
      {
        $inc: { countOpened: 1},
      },
      {
        new: true
      }).exec()
    if(!updateCountOpened) throw new NotFoundException('cant be refreshed because')

    return updateCountOpened
  }

  async getById(_id: string){
    const actor = await this.MovieModel.findById(_id)
    if(!actor) throw new NotFoundException('actor not found')
    return actor
  }

  async create(){
    const defaultValue: CreateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    }
    const movie = await this.MovieModel.create(defaultValue)
    return movie._id
  }

  async update(_id:string, dto: UpdateMovieDto){
    //telegram
    const updateMovie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true
    }).exec()

    if(!updateMovie) throw new NotFoundException('Actor not found')

    return updateMovie;
  }

  async delete(_id:string){
    const deleteMovie = await this.MovieModel.findByIdAndDelete(_id)
    if(!deleteMovie) throw new NotFoundException('Actor not found')
    return deleteMovie;
  }
}
