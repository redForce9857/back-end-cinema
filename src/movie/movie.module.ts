import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Movie } from './model/movie.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: Movie,
        schemaOptions: {
          collection: 'Movie',
        }
      }
    ])
  ],
  controllers: [MovieController],
  providers: [MovieService]
})
export class MovieModule {}
