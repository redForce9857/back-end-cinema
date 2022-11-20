import { mongoose, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export interface Genre extends Base {}

export class Genre extends TimeStamps {

	@prop()
	name:string;

	@prop({unique: true})
	slug:string;

	@prop()
	description:string;
	
	@prop()
	icon:string;
}
