import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Game} from "../entities/game.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {SecurityService} from "../services/security.service";
import {MyFlashMessagesService} from "../services/my-flash-messages.service";

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
        private security: SecurityService,
        private myFlashMessages: MyFlashMessagesService,
        private router: Router
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
                        this.security.logout();
                        break;
                    case 403 :
                        this.router.navigate(['']);
                        this.myFlashMessages.addError("You are not a player on this game.");
                        break;
                    case 404 :
                        this.router.navigate(['']);
                        this.myFlashMessages.addError("This game doesn't exist. It might have been removed.");
                        break;
                }
            });
    }

};