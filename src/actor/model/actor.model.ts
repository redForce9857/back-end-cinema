import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface Actor extends Base {}

export class Actor extends TimeStamps{
	@prop()
	name: string;

	@prop({unique: true})
	slug: string;

	@prop()
	photo: string
}
