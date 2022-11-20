import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateDto } from './dto/update-userProfile';
import { genSalt, hash } from 'bcryptjs';
import { User } from './model/user.model';

@Injectable()
export class UserService {
	constructor(@InjectModel(User) private readonly UserModel: ModelType<User>){}

	async getById(_id:string){
		const user = await this.UserModel.findById(_id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user
	}

	async updateProfile(_id: string, dto: UpdateDto){
		const user = await this.getById(_id);
		const isTheSameUser = await this.UserModel.findOne({email: dto.email})

		if(isTheSameUser && String(_id) !== String(isTheSameUser._id)){
			throw new NotFoundException('Email is busy')
		}

		if(dto.password){
			const salt = await genSalt(10)
			user.password = await hash(dto.password, salt)
		}

		user.email = dto.email
		if(dto.isAdmin || dto.isAdmin === false){
			user.isAdmin = dto.isAdmin
		}

		await user.save()

		return
	}

	async getCount(){
		return await this.UserModel.find().count().exec()
	}

	async getAll(searchTerm?: string){
		let options = {}
		if(searchTerm){
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i')//i mean no meter what letter is there big ot small
					}
				]
			}
		}
		return await this.UserModel.find(options).select('-password -updatedAt -__v').sort({createdAt: 'desc'}).exec()
	}

	async delete(id: string){
		return await this.UserModel.findByIdAndDelete(id).exec()
	}
}
