import {User} from "./user.entity";
export class Game {

    constructor(
        public id: number,
        public creator: User,
        public guest: User,
        public opponent: User,
        public _links: any,
        public acceptedAt: string
    ) {}

    getOpponentOf(playerId: number):User {
        if(this.creator.id == playerId) {
            return this.guest;
        }
        return this.creator;
    }

}