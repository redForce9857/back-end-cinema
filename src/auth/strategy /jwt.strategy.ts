import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { InjectModel } from "nestjs-typegoose";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { Injectable } from "@nestjs/common";
import { User } from "src/user/model/user.model";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
	constructor(private readonly configService: ConfigService, @InjectModel(User) private readonly UserModel: ModelType<User>){
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET')
		})
	}

	async validate({_id}: Pick<User, '_id'>){
		return await this.UserModel.findById(_id).exec()
	}
}