import {Component, OnInit, Input} from '@angular/core';
import {Game} from "../entities/entities/game.entity";
import {User} from "../entities/entities/user.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

    // #f1ed2e
    // #dad745

    @Input()
    game: Game;

    @Input()
    profile: User;

    from:       string|null = null;
    to:         string|null = null;
    promotion:  string|null = null;

    constructor(
        private chessApiClient: ChessApiClientService
    ) {}

    ngOnInit() {
        console.log(this.game);
        this.resizeContainer();
        this.loopPull();
    }

    resizeContainer() {
        let containerWidth = document.getElementById('game-result').offsetWidth;
        let unit = containerWidth / 9;
        if(window.innerWidth > window.innerHeight) { // Landscape mode
            let containerHeight = window.innerHeight - 100;
            unit = containerHeight / 11;
        }

        let chessboards = document.querySelectorAll('.chessboard-wrapper');
        [].forEach.call(chessboards, chessboard => {
            chessboard.style.width = (9 * unit) + 'px';
            chessboard.style.height = (11 * unit) + 'px';
        });

        setTimeout(() => {
            let tds = document.querySelectorAll('td');
            for(let h = 0; h < tds.length; h++) {
                tds[h].style.height = unit + 'px';
            }
            this.hideOtherColorContainer();
        }, 100);

    }

    hideOtherColorContainer() {
        if(this.game.getColorByUser(this.profile) == Game.COLOR_WHITE ) {
            document.getElementById('chessboard-wrapper-by-black').style.display = 'none';
        } else {
            document.getElementById('chessboard-wrapper-by-white').style.display = 'none';
        }
    }

    reset(data) {
        this.game.wonBy = data.wonBy;
        this.game.winType = data.winType;
        this.game.endedAt = data.endedAt;
        this.game.result = data.result;
        this.game.chessboard = data.chessboard;
        this.game.playingColor = data.playingColor;
        this.game.possibleMoves = data.possibleMoves;
        this.game.fen = data.fen;
        this.game.pgn = data.pgn;
    }

    pullOriginAndReset() {
        this.chessApiClient.getGame(this.game.id, false).then(response => {
            if(response.status != 200) {}
            this.reset(response.json());
        });
    }

    play() {
        this.game.chessboard[this.to] = this.game.chessboard[this.from];
        this.game.chessboard[this.from] = '';

        this.chessApiClient.play(this.game, this.from, this.to, null).then(response => {
            if(response.status != 200) {
                this.pullOriginAndReset();
            }
            this.reset(response.json());
        });

        this.from = null;
        this.to = null;
        this.game.switchPlayingColor();
    }

    onClickSquare(square: string) {

        if(!this.game.isInProgress()) {
            return;
        }
        if(!this.game.isUserTurn(this.profile)) {
            return;
        }

        if(this.from == null && this.game.isPossibleFrom(square)) {
            this.from = square;
            return;
        }

        if(this.game.isPossibleFromTo(this.from, square)) {
            this.to = square;
            this.play();
            return;
        }

        if(this.game.isPossibleFrom(square)) {
            this.from = square;
            return;
        }

    }

    loopPull() {
        setInterval(() => {
            this.pullOriginAndReset();
        }, 1000);
    }

}