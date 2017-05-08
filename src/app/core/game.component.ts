import {Component, OnInit, Input} from '@angular/core';
import {Game} from "../entities/game.entity";

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    @Input()
    game: Game;

    ngOnInit() {
        console.log(this.game);
    }

}
