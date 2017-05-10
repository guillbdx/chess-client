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
    ) {}

    /**
     *
     * @param user
     * @returns {User}
     */
    getOpponent(user: User): User {
        if(this.creator.id == user.id) {
            return this.guest;
        }
        return this.creator;
    }

    /**
     *
     * @returns {string}
     */
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

    /**
     *
     * @param user
     * @returns {string}
     */
    getColorByUser(user: User): string {
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

    /**
     *
     * @param color
     * @returns {User}
     */
    getUserByColor(color: string): User {

        if(this.creatorIsWhite) {
            if(color == Game.COLOR_WHITE) {
                return this.creator;
            } else {
                return this.guest;
            }
        }

        if(!this.creatorIsWhite) {
            if(color == Game.COLOR_WHITE) {
                return this.guest;
            } else {
                return this.creator;
            }
        }

    }

    /**
     *
     * @param user
     * @returns {boolean}
     */
    isUserTurn(user: User): boolean {
        let userColor = this.getColorByUser(user);
        return userColor == this.playingColor;
    }

}