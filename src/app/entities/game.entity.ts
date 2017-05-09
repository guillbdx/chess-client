import {User} from "./user.entity";

export class Game {

    static readonly COLOR_WHITE = 'w';

    static readonly COLOR_BLACK = 'b';

    constructor(
        public id: number,

        public creatorIsWhite: boolean,
        public fen: string,
        public pgn: string,
        public playingColor: string,
        public possibleMoves: Object[],
        public result: string,
        public sentenceResult: string,
        public currentUserColor: string,
        public isCurrentUserTurn: boolean,
        public chessboard: string|void[],

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
        if(game.creator.id == user.id) {
            return game.guest;
        }
        return game.creator;
    }

    static getUserColor(game: Game, user: User): string {
        if(game.creator.id == user.id) {
            if(game.creatorIsWhite) {
                return Game.COLOR_WHITE;
            }
            return Game.COLOR_BLACK;
        }

        if(game.guest.id == user.id) {
            if(game.creatorIsWhite) {
                return Game.COLOR_BLACK;
            }
            return Game.COLOR_WHITE;
        }
    }

    static isUserTurn(game: Game, user: User) {
        let userColor = Game.getUserColor(game, user);
        return userColor == game.playingColor;
    }

    static getSentenceResult(game: Game): string {
        let sentence = '';
        switch(game.result) {
            case '0-1' :
                sentence = 'Black won !';
                break;
            case '1-0' :
                sentence = 'White won';
                break;
            case '1/2-1/2' :
                sentence = 'Draw';
                break;
        }
        return sentence;
    }

}