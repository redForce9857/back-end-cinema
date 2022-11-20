import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './model/actor.model';

@Injectable()
export class ActorService {
  constructor(@InjectModel(Actor) private ActorModel: ModelType<Actor>){}

  async getSlug(slug: string){
    const doc =  await this.ActorModel.findOne({slug}).exec()
    if(!doc) throw new NotFoundException('slug not found')

    return doc
  }

  async getAll(searchTerm?: string ){
    let option = {}

    if (searchTerm) {
      option = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i')
          },
          {
            slug: new RegExp(searchTerm, 'i')
          },
          {
            photo: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }
    //agreation

    return await this.ActorModel.find(option)
    .select('-updatedAt -__v')
    .sort({
      createdAt: 'desc',
    })
    .exec()
  }

  //Admin Side

  async getById(_id: string){
    const actor = await this.ActorModel.findById(_id)
    if(!actor) throw new NotFoundException('actor not found')
    return actor
  }

  async create(){
    const defaultValue: CreateActorDto = {
      name: '',
      slug: '',
      photo: '',
    }
    const actor = await this.ActorModel.create(defaultValue)

    return actor._id
  }

  async update(_id:string, dto: UpdateActorDto){
    const updateActor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
      new: true
    }).exec()

    if(!updateActor) throw new NotFoundException('Actor not found')

    return updateActor;
  }

  async delete(_id:string){
    const deleteActor = await this.ActorModel.findByIdAndDelete(_id)
    if(!deleteActor) throw new NotFoundException('Actor not found')
    return deleteActor;
  }
}
