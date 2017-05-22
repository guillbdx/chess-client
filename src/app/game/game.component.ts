import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Game} from "../entities/entities/game.entity";
import {User} from "../entities/entities/user.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {Chessboard3d} from "./chessboard3d";
import Scene = BABYLON.Scene;
import Engine = BABYLON.Engine;
import * as jQuery from 'jquery';
import {MoveFactory} from "../entities/factories/move.factory";
import {GameFactory} from "../entities/factories/game.factory";

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

    @Input()
    game: Game;

    @Input()
    profile: User;

    from:       string|null = null;
    to:         string|null = null;
    promotion:  string|null = null;

    sendingMoveInProgress = false;
    refreshingInterval: any;

    showPromotionPanel = false;

    showSharePanel = false;

    chessboard3d: Chessboard3d;

    sharingUrl: string;

    constructor(
        private chessApiClient: ChessApiClientService
    ) {
    }

    //---------------------------------------------------------------------
    // GLOBAL ACTIONS
    //---------------------------------------------------------------------

    /**
     * Resizes, pulls and reset data, and launches the refreshing interval.
     */
    ngOnInit() {
        this.resizeContainer();
        this.sharingUrl = location.protocol + '//' + window.location.host + '/shared-game/' + this.game.id;
        // let canvas = <HTMLCanvasElement>document.getElementById('canvas');
        // let engine = new Engine(canvas, true);
        // BABYLON.SceneLoader.Load("", 'assets/scene/chessboard-03.babylon', engine, (scene) => {
        //     scene.executeWhenReady(() => {
        //         this.initChessboard3d(canvas, scene, engine);
        //         this.displayViewType('2d');
        //         this.pullOriginAndReset();
        //         this.loopPull();
        //         this.hideOtherColorContainer();
        //     });
        // });

        this.displayViewType('2d');
        this.pullOriginAndReset();
        this.loopPull();
        this.hideOtherColorContainer();
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
     * Hides the opposite color view
     */
    hideOtherColorContainer() {
        if(this.game.getColorByUser(this.profile) == Game.COLOR_BLACK ) {
            jQuery('.view-by-white').hide();
        } else {
            jQuery('.view-by-black').hide();
        }
        // Active black camera
        if(this.game.getColorByUser(this.profile) == Game.COLOR_BLACK ) {
            //this.chessboard3d.activeCamera('b');
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

    /**
     *
     * @param canvas
     * @param scene
     * @param engine
     */
    initChessboard3d(canvas: HTMLCanvasElement, scene: Scene, engine: Engine) {
        this.chessboard3d = new Chessboard3d(canvas, scene, this);
        this.chessboard3d.initSceneEnvironment();
        this.chessboard3d.recreatePieces(this.game.chessboard);
        this.chessboard3d.activeClickListener();
        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    /**
     * Displays / hides 2d or 3d view
     */
    displayViewType(viewType: string): void {
        if(viewType == '2d') {
            document.getElementById('body-game-2d').style.display = 'block';
            document.getElementById('body-game-3d').style.display = 'none';
            document.getElementById('btn-display-3d-view').style.display = 'block';
            document.getElementById('btn-display-2d-view').style.display = 'none';
        }
        if(viewType == '3d') {
            document.getElementById('body-game-2d').style.display = 'none';
            document.getElementById('body-game-3d').style.display = 'block';
            document.getElementById('btn-display-3d-view').style.display = 'none';
            document.getElementById('btn-display-2d-view').style.display = 'block';
        }
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

        //this.chessboard3d.recreatePieces(data.chessboard);

    }

    /**
     * Pulls data and launches reset function
     */
    pullOriginAndReset() {
        this.chessApiClient.getGame(this.game.id, false).then(response => {
            let data = response.json();
            if(this.sendingMoveInProgress) {
                return;
            }
            let dataLastMove = MoveFactory.createMoveFromData(data.lastMove);
            if(this.game.lastMove != null && !this.game.lastMove.isSameMove(dataLastMove)) {
                this.game.applyMove(dataLastMove);
                return;
            }
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
     * Launches preview function, switch player color, hides promotions panel, colors and reset from to squares.
     * Sends the move to origin.
     */
    play() {

        let move = this.game.createMove(this.from, this.to, this.promotion);
        this.game.applyMove(move);

        this.sendingMoveInProgress = true;
        this.showPromotionPanel = false;

        this.chessApiClient.play(this.game, this.from, this.to, this.promotion).then(response => {
            this.sendingMoveInProgress = false;
        });

        this.from = null;
        this.to = null;
        this.promotion = null;

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

        if(!this.game.isInProgress()) {
            return;
        }
        if(!this.game.isUserTurn(this.profile)) {
            return;
        }

        if(this.from == null && this.game.isPossibleFrom(square)) {
            this.from = square;
            this.game.chessboard[square]['selected'] = true;
            console.log(this.game.chessboard[square]);
            return;
        }

        if(this.game.isPossibleFromTo(this.from, square)) {
            this.to = square;
            // YYY
            this.promptPromotionIfNeededThenPlay();
            return;
        }

        if(this.game.isPossibleFrom(square)) {
            this.from = square;
            this.game.chessboard[square]['selected'] = true;
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

}