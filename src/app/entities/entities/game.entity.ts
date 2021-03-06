import {User} from "./user.entity";
import {Move} from "./move.entity";
import {GridSquare} from "./grid-square.entity";

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
        public chessboard?         : GridSquare[],
        public acceptedAt?         : string,
        public endedAt?            : string,
        public wonBy?              : string,
        public winType?            : string,
        public lastMove?           : Move|null
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

    /**
     *
     */
    switchPlayingColor() {
        if(this.playingColor == Game.COLOR_WHITE) {
            this.playingColor = Game.COLOR_BLACK;
            return;
        }
        this.playingColor = Game.COLOR_WHITE;
    }

    /**
     *
     * @param from
     * @param to
     * @returns {boolean}
     */
    isPromotionNeeded(from: string, to: string): boolean {
        for(let possibleMove of this.possibleMoves) {
            if(possibleMove['from'] == from && possibleMove['to'] == to && possibleMove['promotion'] == 'q') {
                return true;
            }
        }
        return false;
    }

    /**
     *
     * @param from
     * @param to
     * @returns {any}
     */
    getCastlingType(from: string, to: string): string|null {
        for(let possibleMove of this.possibleMoves) {
            if(possibleMove['from'] == from && possibleMove['to'] == to && possibleMove['flags'] == 'q') {
                return possibleMove['color']==Game.COLOR_WHITE ? 'Q' : 'q';
            }
            if(possibleMove['from'] == from && possibleMove['to'] == to && possibleMove['flags'] == 'k') {
                return possibleMove['color']==Game.COLOR_WHITE ? 'K' : 'k';
            }
        }
        return null;
    }

    /**
     *
     * @param from
     * @param to
     * @returns {any}
     */
    getInPassingCapturedSquare(from: string, to: string): string|null {
        for(let possibleMove of this.possibleMoves) {
            if(possibleMove['from'] == from && possibleMove['to'] == to && possibleMove['flags'] == 'e') {
                return Game.getBehindSquare(possibleMove['to'], possibleMove['color']);
            }
        }
        return null;
    }

    /**
     *
     * @param square
     * @param color
     * @returns {string}
     */
    static getBehindSquare(square: string, color: string): string {
        let splitedSquare = square.split('');
        let letter = splitedSquare[0];
        let number = +splitedSquare[1];
        if(color == Game.COLOR_WHITE) {
            return letter + (number - 1);
        }
        if(color == Game.COLOR_BLACK) {
            return letter + (number + 1);
        }
    }

    /**
     *
     * @param square
     * @returns {any}
     */
    getColorPieceOnSquare(square: string): string {
        if(this.chessboard[square]['piece'] == null) {
            return null;
        }
        return this.chessboard[square]['piece'].charAt(0);
    }

    /**
     *
     * @param color
     * @returns {string}
     */
    getOppositeColor(color: string): string {
        if(color == Game.COLOR_WHITE) {
            return Game.COLOR_BLACK;
        }
        return Game.COLOR_WHITE;
    }

    /**
     *
     * @param from
     * @param to
     * @param promotion
     * @returns {any}
     */
    createMove(from: string, to: string, promotion: string|null): Move {
        if(!this.isPossibleFromTo(from, to)) {
            return null
        }
        let color = this.getColorPieceOnSquare(from);
        let castlingType = this.getCastlingType(from, to);
        let inPassingCapturedSquare = this.getInPassingCapturedSquare(from, to);
        return new Move(
            color,
            from,
            to,
            promotion,
            castlingType,
            inPassingCapturedSquare
        );
    }

    /**
     *
     * @param move
     */
    applyMove(move: Move): void {

        this.playingColor = this.getOppositeColor(move.color);

        this.chessboard[move.to]['piece'] = this.chessboard[move.from]['piece'];
        this.chessboard[move.from]['piece'] = '';

        if(move.promotion != null) {
            this.chessboard[move.to]['piece'] = move.color + '-' + move.promotion;
        }

        if(move.castlingType != null) {
            switch(move.castlingType) {
                case 'Q' :
                    this.chessboard['a1']['piece'] = '';
                    this.chessboard['d1']['piece'] = 'w-r';
                    break;
                case 'K' :
                    this.chessboard['h1']['piece'] = '';
                    this.chessboard['f1']['piece'] = 'w-r';
                    break;
                case 'q' :
                    this.chessboard['a8']['piece'] = '';
                    this.chessboard['d8']['piece'] = 'b-r';
                    break;
                case 'k' :
                    this.chessboard['h8']['piece'] = '';
                    this.chessboard['f8']['piece'] = 'b-r';
                    break;
            }
        }

        if(move.inPassingSquare != null) {
            this.chessboard[move.inPassingSquare]['piece'] = '';
        }

        this.lastMove = move;

        this.setSpecialSquares();

    }

    /**
     *
     * @param selectedSquare
     */
    setSpecialSquares(selectedSquare?: string) {
        for(let i in this.chessboard) {
            this.chessboard[i].selected = false;
            this.chessboard[i].lastFrom = false;
            this.chessboard[i].lastTo = false;
        }
        if(this.lastMove != null) {
            this.chessboard[this.lastMove.from]['lastFrom'] = true;
        }
        if(this.lastMove != null) {
            this.chessboard[this.lastMove.to]['lastTo'] = true;
        }
        if(selectedSquare != null) {
            this.chessboard[selectedSquare]['selected'] = true;
        }
    }

}