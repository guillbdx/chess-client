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

    ngOnInit() {
        this.resizeContainer();
        this.loopPull();
    }

    ngOnDestroy() {
        clearInterval(this.refreshingInterval);
    }

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

    hideOtherColorContainer() {
        if(this.game.getColorByUser(this.profile) == Game.COLOR_WHITE ) {
            document.getElementById('chessboard-wrapper-by-black').style.display = 'none';
        } else {
            document.getElementById('chessboard-wrapper-by-white').style.display = 'none';
        }
    }

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
    }

    pullOriginAndReset() {
        this.chessApiClient.getGame(this.game.id, false).then(response => {
            if(response.status != 200) {}
            this.reset(response.json());
        });
    }

    play() {
        this.previewMove();
        this.game.switchPlayingColor();
        this.refreshing = false;
        this.showPromotionPanel = false;

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

    promptPromotionIfNeededThenPlay() {
        let needPromotion = this.game.isPromotionNeeded(this.from, this.to);
        if(!needPromotion) {
            this.play();
            return;
        }
        this.showPromotionPanel = true;
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
            this.promptPromotionIfNeededThenPlay();
            return;
        }

        if(this.game.isPossibleFrom(square)) {
            this.from = square;
            return;
        }

    }

    loopPull() {
        this.refreshingInterval = setInterval(() => {
            this.pullOriginAndReset();
        }, 3000);
    }

    onClosePromotionPanel() {
        this.showPromotionPanel = false;
        this.from = null;
        this.to = null;
        this.promotion = null;
    }

    onSelectPromotion(promotion: string) {
        this.promotion = promotion;
        this.play();
    }

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

}