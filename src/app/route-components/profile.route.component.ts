import {Component, OnInit} from '@angular/core';
import {User} from "../entities/user.entity";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {LoaderService} from "../services/loader.service";

@Component({
    templateUrl: './profile.route.component.html',
})
export class ProfileRouteComponent implements OnInit {

    profile: User;

    constructor(
        private chessApiClient: ChessApiClientService,
        private loader: LoaderService
    ) {}

    ngOnInit() {
        this.loader.show();
        this.chessApiClient.getProfile()
            .then(user => {
                this.profile = user;
                this.loader.hide();
            });
    }

};