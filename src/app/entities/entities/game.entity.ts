import {User} from "./user.entity";

export class Game {

    static readonly COLOR_WHITE = 'w';

    static readonly COLOR_BLACK = 'b';

    constructor(
        public creator             : User,
        public guest               : User,
        public id                  : number,
        public creatorIsWhite      : boolean,
        public createdAt           : string,
        public fen?                : string,
        public pgn?                : string,
        public playingColor?       : string,
        public possibleMoves?      : Object[],
        public result?             : string,
        public chessboard?         : string[],
        public acceptedAt?         : string,
        public endedAt?            : string,
    ) {

    }

    getOpponent(user: User): User {
        if(this.creator.id == user.id) {
            return this.guest;
        }
        return this.creator;
    }

    getSentenceResult(): string {
        let sentence = '';
        switch(this.result) {
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

    getUserColor(user: User): string {
        if(this.creator.id == user.id) {
            if(this.creatorIsWhite) {
                return Game.COLOR_WHITE;
            }
            return Game.COLOR_BLACK;
        }

        if(this.guest.id == user.id) {
            if(this.creatorIsWhite) {
                return Game.COLOR_BLACK;
            }
            return Game.COLOR_WHITE;
        }
    }

    isUserTurn(user: User): boolean {
        let userColor = this.getUserColor(user);
        return userColor == this.playingColor;
    }

}