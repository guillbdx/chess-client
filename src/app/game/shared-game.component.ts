import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Game} from "../entities/entities/game.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import * as jQuery from 'jquery';

@Component({
    selector: 'shared-game',
    templateUrl: './shared-game.component.html',
    styleUrls: ['./game.component.css']
})
export class SharedGameComponent implements OnInit, OnDestroy {

    @Input()
    game: Game;

    from:       string|null = null;
    to:         string|null = null;
    promotion:  string|null = null;

    refreshing = true;
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
        if(!this.refreshing) {
            return;
        }
        this.game.wonBy = data.wonBy;
        this.game.winType = data.winType;
        this.game.endedAt = data.endedAt;
        this.game.result = data.result;
        this.game.chessboard = data.chessboard;
        this.game.playingColor = data.playingColor;
        this.game.possibleMoves = data.possibleMoves;
        this.game.fen = data.fen;
        this.game.pgn = data.pgn;
        this.game.lastMove = data.lastMove;

        this.colorCurrentFromToSquare();
        this.colorLastFromToSquare();
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

    /**
     * Checks if a promotion is needed. If so, opens the panel. If not, launches play function.
     */
    promptPromotionIfNeededThenPlay() {

    }

    /**
     * Launches preview function, switch player color, hides promotions panel, colors and reset from to squares.
     * Sends the move to origin.
     */
    play() {


    }

    //---------------------------------------------------------------------
    // SHOW MOVE
    //---------------------------------------------------------------------

    /**
     * Plays a move on the view. (nothing is sent to origin)
     */
    showMove(from: string, to: string, promotion?: string) {

    }

    /**
     *
     * @param from
     * @param to
     */
    showNormalMove(from: string, to: string) {

    }

    /**
     *
     * @param from
     * @param to
     * @param promotion
     */
    showPromotionMoveAddOn(from: string, to: string, promotion: string) {
    }

    /**
     *
     * @param from
     * @param to
     * @param castlingType
     */
    showCastlingMoveAddOn(from: string, to: string, castlingType: string) {

    }

    /**
     *
     * @param from
     * @param to
     * @param inPassingCapturedSquare
     */
    showInPassingMoveAddOn(from: string, to: string, inPassingCapturedSquare: string) {
    }


    //---------------------------------------------------------------------
    // EVENTS
    //---------------------------------------------------------------------

    /**
     * Triggered when the user click on a square.
     *
     * @param square
     */
    onClickSquare(square: string) {



    }

    /**
     * Triggered when the user closes the promotion panel
     */
    onClosePromotionPanel() {

    }

    /**
     * Triggered when the user selects a promotion in the promotin panel
     *
     * @param promotion
     */
    onSelectPromotion(promotion: string) {

    }

    /**
     * Triggered when the user clicks on Resign button
     */
    onResign() {

    }

    //---------------------------------------------------------------------
    // FROM - TO SQUARES COLORS
    //---------------------------------------------------------------------

    /**
     * Removes styles last-from and last-to on each square
     */
    uncolorLastFromToSquare() {
        jQuery('td').removeClass('last-from');
        jQuery('td').removeClass('last-to');
    }

    /**
     * Applies style last-from and last-to on from and to squares
     */
    colorLastFromToSquare() {
        if(this.game.lastMove == undefined) {
            return;
        }
        this.uncolorLastFromToSquare();
        jQuery('td.' + this.game.lastMove['from']).addClass('last-from');
        jQuery('td.' + this.game.lastMove['to']).addClass('last-to');
    }

    /**
     * Removes styles current-from and current-to on each square
     */
    uncolorCurrentFromToSquare() {
        jQuery('td').removeClass('current-from');
        jQuery('td').removeClass('current-to');
    }

    /**
     * Applies style current-from and current-to on from and to squares
     */
    colorCurrentFromToSquare() {
        this.uncolorCurrentFromToSquare();
        if(this.from == null) {
            return;
        }
        jQuery('td.' + this.from).addClass('current-from');
        if(this.to == null) {
            return;
        }
        jQuery('td.' + this.to).addClass('current-to');
    }


}