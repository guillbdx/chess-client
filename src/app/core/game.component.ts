import {Component, OnInit, Input} from '@angular/core';
import {Game} from "../entities/entities/game.entity";
import {User} from "../entities/entities/user.entity";

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    @Input()
    game: Game;

    unit: number;

    @Input()
    profile: User;

    ngOnInit() {
        console.log(this.game);
        this.setUnit();
        this.resizeContainer();
    }

    setUnit() {
        let containerWidth = document.getElementById('chessboard-wrapper-by-white').offsetWidth;
        this.unit = containerWidth / 9;
        if(window.innerWidth > window.innerHeight) { // Landscape mode
            let containerHeight = window.innerHeight - 100;
            this.unit = containerHeight / 11;
        }
    }

    resizeContainer() {
        document.getElementById('chessboard-wrapper-by-white').style.width = (9 * this.unit) + 'px';
        document.getElementById('chessboard-wrapper-by-white').style.height = (11 * this.unit) + 'px';
        let tds = document.querySelectorAll('td');
        for(let h = 0; h < tds.length; h++) {
            tds[h].style.height = this.unit + 'px';
        }
    }

}
