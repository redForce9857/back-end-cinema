import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export interface User extends Base{}

export class User extends TimeStamps{

	@prop({unique: true})
	email: string;

	@prop()
	password: string;

	@prop({default : false})
	isAdmin: boolean;

	@prop({default: []})
	favorites?: []
}