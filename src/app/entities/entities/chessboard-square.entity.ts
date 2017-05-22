export class ChessboardSquare {

    constructor(
        public piece: string,
        public selected: boolean,
        public lastFrom: boolean,
        public lastTo: boolean
    ) {
        this.selected = false;
        this.lastFrom = false;
        this.lastTo = false;
    }

}