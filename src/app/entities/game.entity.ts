import {User} from "./user.entity";
export class Game {

    constructor(
        public id: number,
        public creator: User,
        public guest: User,
        public opponent: User,
        public _links: any,
        public acceptedAt: string,
        public endedAt: string,
        public createdAt: string,
        public updatedAt: string,
    ) {

    }

    static getOpponentOf(game: Game, user: User):User {

        //console.log(game);
        //console.log(user);

        if(game.creator.id == user.id) {
            return game.guest;
        }
        return game.creator;

    }

}