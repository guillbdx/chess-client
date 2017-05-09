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
        let containerWidth = document.getElementById('game-result').offsetWidth;
        this.unit = containerWidth / 9;
        if(window.innerWidth > window.innerHeight) { // Landscape mode
            let containerHeight = window.innerHeight - 100;
            this.unit = containerHeight / 11;
        }
    }

    resizeContainer() {
        let chessboards = document.querySelectorAll('.chessboard-wrapper');
        [].forEach.call(chessboards, chessboard => {
            // do whatever
            chessboard.style.width = (9 * this.unit) + 'px';
            chessboard.style.height = (11 * this.unit) + 'px';
        });

        setTimeout(() => {
            let tds = document.querySelectorAll('td');
            for(let h = 0; h < tds.length; h++) {
                tds[h].style.height = this.unit + 'px';
            }
            this.hideOtherColorContainer();
        }, 100);

    }

    hideOtherColorContainer() {
        if(this.game.getUserColor(this.profile) == Game.COLOR_WHITE ) {
            document.getElementById('chessboard-wrapper-by-black').style.display = 'none';
        } else {
            document.getElementById('chessboard-wrapper-by-white').style.display = 'none';
        }
    }

}
