import { applyDecorators, UseGuards } from "@nestjs/common";
import { TypeRole } from "../auth.intrface";
import { OnlyAdminGuard } from "../guards/admin.guard";
import { JwtAuthGuards } from '../guards/jwt.guard';


export const Auth = (role: TypeRole = 'user') => 
	applyDecorators(
		role === 'admin' 
		? UseGuards(JwtAuthGuards, OnlyAdminGuard)
		: UseGuards(JwtAuthGuards)
	)