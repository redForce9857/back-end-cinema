import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Actor } from './model/actor.model';


@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: Actor,
        schemaOptions: {
          collection: 'Actor'
        }
      }
    ])
  ],
  controllers: [ActorController],
  providers: [ActorService]
})
export class ActorModule {}
