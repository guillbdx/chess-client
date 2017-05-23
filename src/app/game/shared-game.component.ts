import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Game} from "../entities/entities/game.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import * as jQuery from 'jquery';
import {GameFactory} from "../entities/factories/game.factory";
import {MoveFactory} from "../entities/factories/move.factory";

@Component({
    selector: 'shared-game',
    templateUrl: './shared-game.component.html',
    styleUrls: ['./game.component.css']
})
export class SharedGameComponent implements OnInit, OnDestroy {

    @Input()
    game: Game;

    refreshingInterval: any;

    constructor(
        private chessApiClient: ChessApiClientService
    ) {}

    //---------------------------------------------------------------------
    // GLOBAL ACTIONS
    //---------------------------------------------------------------------

    /**
     * Resizes, pulls and reset data, and launches the refreshing interval.
     */
    ngOnInit() {
        this.resizeContainer();
        this.game.setSpecialSquares();
        this.loopPull();
    }

    /**
     * Clears the refreshing interval
     */
    ngOnDestroy() {
        clearInterval(this.refreshingInterval);
    }

    /**
     * Resizes the container
     */
    resizeContainer() {
        let containerWidth = document.getElementById('width-reference').offsetWidth;
        let unit = containerWidth / 9;
        if(window.innerWidth > window.innerHeight) { // Landscape mode
            let containerHeight = window.innerHeight - 100;
            unit = containerHeight / 9;
        }
        jQuery('.fix-width').css('width', (9 * unit) + 'px');
        jQuery('.fix-height').css('height', (9 * unit) + 'px');
        setTimeout(() => {
            let tds = document.querySelectorAll('td');
            for(let h = 0; h < tds.length; h++) {
                tds[h].style.height = unit + 'px';
            }
        }, 100);
    }


    /**
     * Launches the refreshing interval.
     *
     * This interval is disabled when a play is sent to origin, and re-enabled on origin response.
     */
    loopPull() {
        this.refreshingInterval = setInterval(() => {
            this.pullOriginAndReset();
        }, 10000);
    }


    //---------------------------------------------------------------------
    // GAME
    //---------------------------------------------------------------------

    /**
     * Ressets some data (chessboard, playingColor...)
     * @param data
     */
    reset(data) {
        this.game.wonBy = data.wonBy;
        this.game.winType = data.winType;
        this.game.endedAt = data.endedAt;
        this.game.result = data.result;
        this.game.chessboard = GameFactory.createChessboardFromData(data.chessboard);
        this.game.playingColor = data.playingColor;
        this.game.possibleMoves = data.possibleMoves;
        this.game.fen = data.fen;
        this.game.pgn = data.pgn;
        this.game.lastMove = MoveFactory.createMoveFromData(data.lastMove);

        this.game.setSpecialSquares();

    }

    /**
     * Pulls data and launches reset function
     */
    pullOriginAndReset() {
        this.chessApiClient.getGame(this.game.id, false).then(response => {
            if(response.status != 200) {}
            this.reset(response.json());
        });
    }


}