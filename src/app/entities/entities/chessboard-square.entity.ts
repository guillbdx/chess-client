export class ChessboardSquare {

    constructor(
        private name: string,
        private piece: string,
        private selected: boolean,
        private lastFrom: boolean,
        private lastTo: boolean
    ) {}

}