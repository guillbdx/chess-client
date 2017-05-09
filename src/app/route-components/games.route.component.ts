import {Component, OnInit} from '@angular/core';
import {ChessApiClientService} from "../services/chess-api-client.service";
import {Game} from "../entities/entities/game.entity";
import {User} from "../entities/entities/user.entity";
import {SecurityService} from "../services/security.service";
import {FlashMessagesService} from "../services/flash-messages.service";
import {Router} from "@angular/router";
import {GameFactory} from "../entities/factories/game.factory";
import {UserFactory} from "../entities/factories/user.factory";

@Component({
    templateUrl: './games.route.component.html',
    styleUrls: ['./games.route.component.css']
})
export class GamesRouteComponent implements OnInit {

    profile: User;

    games: any;

    loaded = false;

    constructor(
        private chessApiClient: ChessApiClientService,
        private security: SecurityService,
        private flashMessages: FlashMessagesService,
        private router: Router,
        private gameFactory: GameFactory,
        private userFactory: UserFactory
    ) {}

    ngOnInit() {
        this.userFactory.getProfile().then(profile => {
            this.profile = profile;
        });
        this.retrieveGames();
    }

    retrieveGames() {
        this.gameFactory.getGames().then(games => {
            let unorderedGames = games;
            this.games = {
                inProgress: [],
                proposedByOthers: [],
                proposedToOthers: [],
                ended: []
            };
            for(let unorderedGame of unorderedGames) {
                if(unorderedGame.acceptedAt != null && unorderedGame.endedAt == null) {
                    this.games.inProgress.push(unorderedGame);
                    continue;
                }
                if(unorderedGame.acceptedAt != null && unorderedGame.endedAt != null) {
                    this.games.ended.push(unorderedGame);
                    continue;
                }
                if(unorderedGame.guest.id == this.profile.id) {
                    this.games.proposedByOthers.push(unorderedGame);
                    continue;
                }
                this.games.proposedToOthers.push(unorderedGame);
            }
            this.loaded = true;
        });
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
                        this.router.navigate(['game/' + game.id]);
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


}