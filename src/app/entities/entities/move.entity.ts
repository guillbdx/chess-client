export class Move {
    constructor(
        public color: string,
        public from: string,
        public to: string,
        public promotion: string|null,
        public castlingType: string|null,
        public inPassingSquare: string|null
    ) {}

    /**
     *
     * @param move
     * @returns {boolean}
     */
    isSameMove(move: Move): boolean {
        if(move.color != this.color) {
            return false;
        }
        if(move.from != this.from) {
            return false;
        }
        if(move.to != this.to) {
            return false;
        }
        if(move.promotion != this.promotion) {
            return false;
        }
        if(move.castlingType != this.castlingType) {
            return false;
        }
        if(move.inPassingSquare != this.inPassingSquare) {
            return false;
        }
        return true;
    }

}