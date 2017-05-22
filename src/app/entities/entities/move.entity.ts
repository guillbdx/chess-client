export class Move {
    constructor(
        public color: string,
        public from: string,
        public to: string,
        public promotion: string|null,
        public castlingType: string|null,
        public inPassingSquare: string|null
    ) {}
}