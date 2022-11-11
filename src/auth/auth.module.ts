import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from 'src/user/model/user.model';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/configs/jwt.config';
import { JwtStrategy } from './strategy /jwt.strategy';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
      typegooseClass: UserModel,
      schemaOptions: {
        collection: 'User',
      }
    }
  ]), ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
