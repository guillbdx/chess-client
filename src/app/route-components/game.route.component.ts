import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Game} from "../entities/game.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {SecurityService} from "../services/security.service";
import {FlashMessagesService} from "../services/flash-messages.service";
import {User} from "../entities/user.entity";

@Component({
    templateUrl: './game.route.component.html',
})
export class GameRouteComponent implements OnInit {

    private sub: any;

    id: number;

    profile: User;

    game: Game;

    constructor(
        private route: ActivatedRoute,
        private chessApiClient: ChessApiClientService,
        private security: SecurityService,
        private flashMessages: FlashMessagesService,
        private router: Router
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.retrieveProfile();
        });
    }

    retrieveProfile() {
        this.chessApiClient.getProfile()
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.profile = response.json();
                        this.retrieveGame();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                }
            });
    }

    retrieveGame() {
        this.chessApiClient.getGame(this.id)
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.game = response.json();
                        this.retriveCreator();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                    case 403 :
                        this.router.navigate(['']);
                        this.flashMessages.addError("You are not a player on this game.");
                        break;
                    case 404 :
                        this.router.navigate(['']);
                        this.flashMessages.addError("This game doesn't exist. It might have been removed.");
                        break;
                }
            });
    }

    retriveCreator() {
        this.chessApiClient.getUser(this.game._links.creator.id)
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.game.creator = response.json();
                        this.retrieveGuest();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                    case 404 :
                        this.router.navigate(['']);
                        this.flashMessages.addError("~~~User not found");
                        break;
                }
            });
    }
    retrieveGuest() {
        this.chessApiClient.getUser(this.game._links.guest.id)
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.game.guest = response.json();
                        this.setGameParameters();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                    case 404 :
                        this.router.navigate(['']);
                        this.flashMessages.addError("~~~User not found");
                        break;
                }
            });
    }

    setGameParameters() {
        this.game.opponent = Game.getOpponentOf(this.game, this.profile);
        this.game.currentUserColor = Game.getUserColor(this.game, this.profile);
        this.game.isCurrentUserTurn = Game.isUserTurn(this.game, this.profile);
    }

};