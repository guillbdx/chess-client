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
        public wonBy?              : string,
        public winType?            : string
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

        if(this.wonBy == 'n') {
            return 'Draw !';
        }

        if(this.winType == 'regular') {
            if(this.wonBy == 'w') {
                return 'White won by checkmate !';
            }
            if(this.wonBy == 'b') {
                return 'Black won by checkmate !';
            }
        }
        if(this.winType == 'resign') {
            if(this.wonBy == 'w') {
                return 'White won ! (Black resign)';
            }
            if(this.wonBy == 'b') {
                return 'Black won ! (White resign)';
            }
        }

        return '';
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
     * @returns {boolean}
     */
    isInProgress(): boolean {
        if(this.acceptedAt == null) {
            return false;
        }
        if(this.endedAt != null) {
            return false;
        }
        return true;
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

    /**
     *
     * @param square
     * @returns {boolean}
     */
    isPossibleFrom(square: string): boolean {
        for(let possibleMove of this.possibleMoves) {
            if(possibleMove['from'] == square) {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param from
     * @param to
     * @returns {boolean}
     */
    isPossibleFromTo(from: string, to: string): boolean {
        for(let possibleMove of this.possibleMoves) {
            if(possibleMove['from'] == from && possibleMove['to'] == to) {
                return true;
            }
        }
        return false;
    }

    switchPlayingColor() {
        if(this.playingColor == Game.COLOR_WHITE) {
            this.playingColor = Game.COLOR_BLACK;
            return;
        }
        this.playingColor = Game.COLOR_WHITE;
    }

}