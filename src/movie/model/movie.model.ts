import { prop, Ref } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { Actor } from "src/actor/model/actor.model"
import { Genre } from "src/genre/model/genre.model"

export class Parameters {

	@prop()
	year: number

	@prop()
	duration:number

	@prop()
	country: string
}

export interface Movie extends Base {}

export class Movie extends TimeStamps {

	@prop()
	poster:string

	@prop()
	bigPoster:string

	@prop()
	title:string

	@prop({unique: true})
	slug:string

	@prop()
	parameters?: Parameters

	@prop({default: 4.0})
	rating?: number

	@prop({default: 0})
	countOpened:number

	@prop()
	videoUrl:string

	@prop({ref: () => Genre})
	genres: Ref<Genre>[]

	@prop({ref: () => Actor})
	actors: Ref<Actor>[]

	@prop({default: false})
	isSendTelegram?: boolean
}
