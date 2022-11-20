import { HttpException, Injectable, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { AuthDto } from './dto/auth.dto';
import {hash, genSalt, compare} from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh.token';
import { User } from 'src/user/model/user.model';

@Injectable()
export class AuthService {
	constructor(@InjectModel(User)
	private readonly UserModel: ModelType<User>,
	private readonly jwtService: JwtService
	){}

	async register(dto: AuthDto){
		const oldUser = await this.UserModel.findOne({email: dto.email})
		if (oldUser) {
			throw new HttpException('Sorry this email is already taken', HttpStatus.FOUND)
		}

		const salt = await genSalt(10)

		const newUser = new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt)
		})

		const tokens = await this.issueTokenPair(String(newUser._id))

		newUser.save()

		return {
			user: this.returnUserFields(newUser),
			...tokens
		}
	}

	async login(dto: AuthDto){
		const user =  await this.validate(dto)
		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.returnUserFields(user),
			...tokens
		}
	}

	async getNewTokens({refreshToken}: RefreshTokenDto){
		if(!refreshToken){
			throw new UnauthorizedException('Please sign in!')
		}
		const result = await this.jwtService.verifyAsync(refreshToken);
		if(!result){
			throw new UnauthorizedException('Token is invalid or expired!')
		}

		const user = await this.UserModel.findById(result._id)

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user:  this.returnUserFields(user),
			...tokens
		}
	}

	async validate(dto: AuthDto): Promise<User>{
		const user = await this.UserModel.findOne({email: dto.email})
		if (!user) {
			throw new HttpException('Sorry this email is not exist', HttpStatus.NOT_FOUND)
		}

		const isValid = await compare(dto.password, user.password);
		if (!isValid) {
			throw new HttpException('Sorry this password incorrect', HttpStatus.FORBIDDEN)
		}
		return user
	}

	async issueTokenPair(userId:string){
		const data = {_id: userId}

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d'
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h'
		})

		return {refreshToken, accessToken}
	}

	returnUserFields(user: User){
		return {
			_id: user._id,
			email: user.email,
			isAdmin: user.isAdmin,
			favorites: user.favorites
		}
	}
}
