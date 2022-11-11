import { IsString } from "class-validator";

export class RefreshTokenDto {

	@IsString({
		message: 'You aren`t pass token'
	})
	refreshToken: string
}