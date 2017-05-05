import {Component, OnInit} from '@angular/core';
import {ChessApiClientService} from "../services/chess-api-client.service";
import {Game} from "../entities/game.entity";
import {User} from "../entities/user.entity";
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
        private router: Router
    ) {}

    ngOnInit() {
        this.chessApiClient.getProfile()
            .then(user => {
                this.profile = user;
                this.retrieveGames();
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
            .then(games => {
                this.games = games;
                this.retrieveUsers();
            });
    }

    private retrieveUsers() {
        this.chessApiClient.getUsers(null, null)
            .then(users => {
                this.users = users;
                this.linkUsersToGames();
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
                this.retrieveGames();
            });
    }

    accept(game: Game) {
        this.chessApiClient.acceptGame(game)
            .then(response => {
                this.retrieveGames();
            });
    }

};