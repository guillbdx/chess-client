import {Injectable} from "@angular/core";
import {Move} from "../entities/move.entity";
import {Game} from "../entities/game.entity";

@Injectable()
export class MoveFactory {

    createMove(data: any): Move {

        if(data == null) {
            return null;
        }

        let promotion = null;
        if(data.promotion != null) {
            promotion = data.promotion;
        }

        let castlingType = null;
        if(data.flags=='k' || data.flags=='q') {
            castlingType = data.flags;
            if(data.color == 'w') {
                castlingType = data.flags.toUpperCase();
            }
        }

        let inPassingSquare = null;
        if(data.flags == 'e') {
            inPassingSquare = Game.getBehindSquare(data.to, data.color);
        }

        return new Move(
            data.color,
            data.from,
            data.to,
            promotion,
            castlingType,
            inPassingSquare
        );


    }

}