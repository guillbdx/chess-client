import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Game} from "../entities/entities/game.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {SecurityService} from "../services/security.service";
import {FlashMessagesService} from "../services/flash-messages.service";
import {User} from "../entities/entities/user.entity";
import {UserFactory} from "../entities/factories/user.factory";
import {GameFactory} from "../entities/factories/game.factory";

@Component({
    templateUrl: './game.route.component.html'
})
export class GameRouteComponent implements OnInit {

    private sub: any;

    id: number;
    profile: User;
    game: Game;

    loaded = false;

    constructor(
        private route: ActivatedRoute,
        private chessApiClient: ChessApiClientService,
        private security: SecurityService,
        private flashMessages: FlashMessagesService,
        private router: Router,
        private userFactory: UserFactory,
        private gameFactory: GameFactory
    ) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.retrieveProfile();
        });
    }

    retrieveProfile() {

        this.userFactory.getProfile().then(profile => {
            this.profile = profile;
            this.retrieveGame();
        });

    }

    retrieveGame() {

        this.gameFactory.getGame(this.id).then(game => {
            this.game = game;
            this.loaded = true;
        });

    }



}