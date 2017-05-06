import {Component, OnInit} from '@angular/core';
import {User} from "../entities/user.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";

@Component({
    templateUrl: './profile.route.component.html',
})
export class ProfileRouteComponent implements OnInit {

    profile: User;

    constructor(
        private chessApiClient: ChessApiClientService,
    ) {}

    ngOnInit() {
        this.chessApiClient.getProfile()
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.profile = response.json();
                        break;
                    case 401 :

                        break;
                }
            });
    }

};