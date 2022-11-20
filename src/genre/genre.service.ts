import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './model/genre.model';

@Injectable()
export class GenreService {
  constructor(@InjectModel(Genre) private readonly GenreModel: ModelType<Genre>){}

  async bySlug(slug: string){
    const doc = await this.GenreModel.findOne({slug}).exec();
    if(!doc) throw new NotFoundException('slug not found')
    return doc
  }

  async getCollections(){
    const genres = await this.getAll()
    const collections = genres;
    return collections 
  }

  async getAll(searchTerm?: string){
    let option = {}

    if(searchTerm){
      option = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i')
          },
          {
            slug: new RegExp( searchTerm, 'i')
          },
          {
            description: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }
    return await this.GenreModel.find(option)
        .select('-updatedAt -__v')
        .sort({
          createdAt: 'desc'
        })
        .exec()
  }


  /* Admin part*/

  async create(){
    const defaultValue = {
      name: '',
      slug: '',
      description: '',
      icon: '',
    }
    const genre = await this.GenreModel.create(defaultValue);
    return genre._id
  }


  async update(_id:string, dto: UpdateGenreDto){
    const updateGenre =  await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new:true
    }).exec()

    if(!updateGenre) throw new NotFoundException('Genre not found')

    return updateGenre;
  }

  async byId(_id:string){
    const genre = await this.GenreModel.findById(_id)
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    return genre
  }

  async delete(id:string){
    const deleteGenre = await this.GenreModel.findByIdAndDelete(id).exec()
    if(!deleteGenre) throw new NotFoundException('Genre not found')

    return deleteGenre;
  }

}
