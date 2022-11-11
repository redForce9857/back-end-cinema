import { IsEmail, IsString, MinLength } from "class-validator";


export class AuthDto {

	@IsEmail()
	@IsString()
	email: string;

	@MinLength(6, {
		message: 'Password can not be less then 6 characters'
	})
	@IsString()
	password: string;
}