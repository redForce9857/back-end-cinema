import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Genre } from './model/genre.model';


@Module({
  imports: [
  TypegooseModule.forFeature([
    {
      typegooseClass: Genre,
      schemaOptions: {
          collection: 'Genre'
      },
    },
  ]),
  ],
  controllers: [GenreController],
  providers: [GenreService]
})
export class GenreModule {}
