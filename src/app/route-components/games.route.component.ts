import {Component, OnInit} from '@angular/core';
import {ChessApiClientService} from "../services/chess-api-client.service";
import {Game} from "../entities/game.entity";
import {User} from "../entities/user.entity";
import {I18nService} from "../services/i18n.service";
import {LoaderService} from "../services/loader.service";
import {SecurityService} from "../services/security.service";
import {FlashMessagesService} from "../services/flash-messages.service";
import {Router} from "@angular/router";

@Component({
    templateUrl: './games.route.component.html',
    styleUrls: ['./games.route.component.css']
})
export class GamesRouteComponent implements OnInit {

    games: Game[];

    users: User[];

    orderedGames = {
        inProgress: [],
        proposedByOthers: [],
        proposedToOthers: [],
        ended: []
    };

    profile: User;

    constructor(
        private chessApiClient: ChessApiClientService,
        private security: SecurityService,
        private flashMessages: FlashMessagesService,
        private router: Router
    ) {}

    ngOnInit() {

        this.chessApiClient.getProfile()
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.profile = response.json();
                        this.retrieveGames();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                }
            });

    }

    private retrieveGames() {

        this.orderedGames = {
            inProgress: [],
            proposedByOthers: [],
            proposedToOthers: [],
            ended: []
        };

        this.chessApiClient.getGames()
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.games = response.json()._embedded.resources;
                        this.retrieveUsers();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                }
            });
    }

    private retrieveUsers() {
        this.chessApiClient.getUsers(null, null)
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.users = response.json()._embedded.resources;
                        this.linkUsersToGames();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                }
            });
    }

    private linkUsersToGames() {
        for(let game of this.games) {
            game.creator = this.findUserById(game._links.creator.id);
            game.guest = this.findUserById(game._links.guest.id);
            game.opponent = Game.getOpponentOf(game, this.profile);
        }
        this.orderGames();
    }

    private orderGames() {
        for(let game of this.games) {
            if(game.acceptedAt != null && game.endedAt == null) {
                this.orderedGames.inProgress.push(game);
                continue;
            }
            if(game.acceptedAt != null && game.endedAt != null) {
                this.orderedGames.ended.push(game);
                continue;
            }
            if(game.guest.id == this.profile.id) {
                this.orderedGames.proposedByOthers.push(game);
                continue;
            }
            this.orderedGames.proposedToOthers.push(game);
        }
    }

    private findUserById(id: number): User {
        for(let i = 0; i < this.users.length; i++) {
            if(id == this.users[i].id) {
                return this.users[i];
            }
        }
        return null;
    }

    refuse(game: Game) {
        this.chessApiClient.refuseGame(game)
            .then(response => {
                switch(response.status) {
                    case 204 :
                        this.retrieveGames();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                    case 403 :
                        this.router.navigate(['']);
                        this.flashMessages.addError("You are not a player on this game.");
                        break;
                    case 404 :
                        this.flashMessages.addError("This game doesn't exist. It might have been removed.");
                        break;
                }
            });
    }

    accept(game: Game) {
        this.chessApiClient.acceptGame(game)
            .then(response => {
                switch(response.status) {
                    case 204 :
                        this.retrieveGames();
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                    case 403 :
                        this.router.navigate(['']);
                        this.flashMessages.addError("You are not a player on this game.");
                        break;
                    case 404 :
                        this.flashMessages.addError("This game doesn't exist. It might have been removed.");
                        break;
                }
            });
    }

};