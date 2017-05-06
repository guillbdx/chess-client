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

    constructor(
        private route: ActivatedRoute,
        private chessApiClient: ChessApiClientService,
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.retrieveGame();
        });
    }

    retrieveGame() {
        this.chessApiClient.getGame(this.id)
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.game = response.json();
                        break;
                    case 401 :

                        break;
                    case 403 :

                        break;
                    case 404 :

                        break;
                }
            });
    }

};