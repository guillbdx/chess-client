import {Component, Input, OnInit} from '@angular/core';
import {Game} from "../entities/entities/game.entity";
import {User} from "../entities/entities/user.entity";
import {Chessboard3d} from "./chessboard3d";

@Component({
    selector: 'game3d',
    templateUrl: 'game3d.component.html',
    styleUrls: ['./game3d.component.css']
})
export class Game3dComponent implements OnInit {

    @Input()
    game: Game;

    @Input()
    profile: User;

    constructor() {}

    ngOnInit() {

        let chessboard3d = new Chessboard3d('canvas', 'assets/scene/chessboard-03.babylon', this);



    }


}