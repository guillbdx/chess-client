import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Game} from "../entities/entities/game.entity";
import {User} from "../entities/entities/user.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

    // #f1ed2e
    // #dad745

    @Input()
    game: Game;

    @Input()
    profile: User;

    from:       string|null = null;
    to:         string|null = null;
    promotion:  string|null = null;

    refreshing = true;
    refreshingInterval: any;

    showPromotionPanel = false;

    constructor(
        private chessApiClient: ChessApiClientService
    ) {}

    //---------------------------------------------------------------------
    // GLOBAL ACTIONS LAUNCHED ONLY ONCE
    //---------------------------------------------------------------------

    /**
     * Resizes, pulls and reset data, and launches the refreshing interval.
     */
    ngOnInit() {
        this.resizeContainer();
        this.pullOriginAndReset();
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
            unit = containerHeight / 11;
        }

        let chessboards = document.querySelectorAll('.chessboard-wrapper');
        [].forEach.call(chessboards, chessboard => {
            chessboard.style.width = (9 * unit) + 'px';
            chessboard.style.height = (11 * unit) + 'px';
        });
        document.getElementById('game-result').style.width = (9 * unit) + 'px';
        document.getElementById('promotion-panel').style.width = (9 * unit) + 'px';

        setTimeout(() => {
            let tds = document.querySelectorAll('td');
            for(let h = 0; h < tds.length; h++) {
                tds[h].style.height = unit + 'px';
            }
            this.hideOtherColorContainer();
        }, 100);

    }

    /**
     * Hides the opposite color view
     */
    hideOtherColorContainer() {
        if(this.game.getColorByUser(this.profile) == Game.COLOR_WHITE ) {
            document.getElementById('chessboard-wrapper-by-black').style.display = 'none';
        } else {
            document.getElementById('chessboard-wrapper-by-white').style.display = 'none';
        }
    }

    /**
     * Launches the refreshing interval.
     *
     * This interval is disabled when a play is sent to origin, and re-enabled on origin response.
     */
    loopPull() {
        this.refreshingInterval = setInterval(() => {
            this.pullOriginAndReset();
        }, 3000);
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
        let needPromotion = this.game.isPromotionNeeded(this.from, this.to);
        if(!needPromotion) {
            this.play();
            return;
        }
        this.showPromotionPanel = true;
    }

    /**
     * Plays a move on the view. (nothing is sent to origin)
     */
    previewMove() {

        this.game.chessboard[this.to] = this.game.chessboard[this.from];
        this.game.chessboard[this.from] = '';

        if(this.promotion != null) {
            this.game.chessboard[this.to] = Game.getUtf8PieceByColorAndType(
                this.game.getColorByUser(this.profile),
                this.promotion
            );
            return;
        }

        let castlingType = this.game.getCastlingType(this.from, this.to);
        switch(castlingType) {
            case 'Q' :
                this.game.chessboard['a1'] = '';
                this.game.chessboard['d1'] = '♖';
                break;
            case 'K' :
                this.game.chessboard['h1'] = '';
                this.game.chessboard['f1'] = '♖';
                break;
            case 'q' :
                this.game.chessboard['a8'] = '';
                this.game.chessboard['d8'] = '♜';
                break;
            case 'k' :
                this.game.chessboard['h8'] = '';
                this.game.chessboard['f8'] = '♜';
                break;
        }

        let inPassingCapturedSquare = this.game.getInPassingCapturedSquare(this.from, this.to);
        if(inPassingCapturedSquare != null) {
            this.game.chessboard[inPassingCapturedSquare] = '';
        }
    }

    /**
     * Launches preview function, switch player color, hides promotions panel, colors and reset from to squares.
     * Sends the move to origin.
     */
    play() {
        this.previewMove();
        this.game.switchPlayingColor();
        this.refreshing = false;
        this.showPromotionPanel = false;
        this.uncolorLastFromToSquare();

        this.chessApiClient.play(this.game, this.from, this.to, this.promotion).then(response => {
            if(response.status == 200) {
                this.reset(response.json());
            }
            this.refreshing = true;
        });

        this.from = null;
        this.to = null;
        this.promotion = null;

    }

    //---------------------------------------------------------------------
    // VIEW EVENTS
    //---------------------------------------------------------------------

    /**
     * Triggered when the user click on a square.
     *
     * @param square
     * @param event
     */
    onClickSquare(square: string, event?) {

        let target = event.target || event.srcElement || event.currentTarget;

        if(!this.game.isInProgress()) {
            return;
        }
        if(!this.game.isUserTurn(this.profile)) {
            return;
        }

        if(this.from == null && this.game.isPossibleFrom(square)) {
            this.from = square;
            this.colorCurrentFromToSquare();
            return;
        }

        if(this.game.isPossibleFromTo(this.from, square)) {
            this.to = square;
            this.colorCurrentFromToSquare();
            this.promptPromotionIfNeededThenPlay();
            return;
        }

        if(this.game.isPossibleFrom(square)) {
            this.from = square;
            this.colorCurrentFromToSquare();
            return;
        }

    }

    /**
     * Triggered when the user closes the promotion panel
     */
    onClosePromotionPanel() {
        this.showPromotionPanel = false;
        this.from = null;
        this.to = null;
        this.promotion = null;
    }

    /**
     * Triggered when the user selects a promotion in the promotin panel
     *
     * @param promotion
     */
    onSelectPromotion(promotion: string) {
        this.promotion = promotion;
        this.play();
    }

    /**
     * Triggered when the user clicks on Resign button
     */
    onResign() {
        this.chessApiClient.resign(this.game).then(response => {
            this.pullOriginAndReset();
        });
    }

    //---------------------------------------------------------------------
    // FROM - TO SQUARES COLORS
    //---------------------------------------------------------------------

    /**
     * Removes styles last-from and last-to on each square
     */
    uncolorLastFromToSquare() {
        let tds = document.querySelectorAll('td');
        [].forEach.call(tds, td => {
            td.classList.remove('last-from');
            td.classList.remove('last-to');
        });
    }

    /**
     * Applies style last-from and last-to on from and to squares
     */
    colorLastFromToSquare() {
        this.uncolorLastFromToSquare();
        if(this.game.lastMove == null) {
            return;
        }
        let tdsLastFrom = document.querySelectorAll('td.' + this.game.lastMove['from']);
        [].forEach.call(tdsLastFrom, tdLastFrom => {
            tdLastFrom.classList.add('last-from');
        });
        let tdsLastTo = document.querySelectorAll('td.' + this.game.lastMove['to']);
        [].forEach.call(tdsLastTo, tdLastTo => {
            tdLastTo.classList.add('last-to');
        });
    }

    /**
     * Removes styles current-from and current-to on each square
     */
    uncolorCurrentFromToSquare() {
        let tds = document.querySelectorAll('td');
        [].forEach.call(tds, td => {
            td.classList.remove('current-from');
            td.classList.remove('current-to');
        });
    }

    /**
     * Applies style current-from and current-to on from and to squares
     */
    colorCurrentFromToSquare() {
        this.uncolorCurrentFromToSquare();
        if(this.from == null) {
            return;
        }
        let tdsLastFrom = document.querySelectorAll('td.' + this.from);
        [].forEach.call(tdsLastFrom, tdLastFrom => {
            tdLastFrom.classList.add('current-from');
        });
        if(this.to == null) {
            return;
        }
        let tdsLastTo = document.querySelectorAll('td.' + this.to);
        [].forEach.call(tdsLastTo, tdLastTo => {
            tdLastTo.classList.add('current-to');
        });
    }


}