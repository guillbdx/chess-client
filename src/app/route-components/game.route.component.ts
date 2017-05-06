import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Game} from "../entities/game.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {LoaderService} from "../services/loader.service";

@Component({
    templateUrl: './game.route.component.html',
})
export class GameRouteComponent implements OnInit {

    private sub: any;

    id: number;

    game: Game;

    loading = true;

    constructor(
        private route: ActivatedRoute,
        private chessApiClient: ChessApiClientService,
        private loader: LoaderService
    ) {}

    ngOnInit() {
        this.loader.show();
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.retrieveGame();
        });
    }

    retrieveGame() {
        this.chessApiClient.getGame(this.id)
            .then(game => {
                this.game = game;
                console.log(this.game);
                this.loader.hide();
            });
    }

};