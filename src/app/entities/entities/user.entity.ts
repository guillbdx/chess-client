export class User {

    constructor(
        public id           : number,
        public username     : string,
        public isComputer   : boolean,
        public email?       : string
    ) {}

}