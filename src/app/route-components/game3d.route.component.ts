import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Game} from "../entities/entities/game.entity";
import {User} from "../entities/entities/user.entity";
import {UserFactory} from "../entities/factories/user.factory";
import {GameFactory} from "../entities/factories/game.factory";

@Component({
    templateUrl: './game3d.route.component.html'
})
export class Game3dRouteComponent implements OnInit {

    private sub: any;

    id: number;
    profile: User;
    game: Game;

    loaded = false;

    constructor(
        private route: ActivatedRoute,
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