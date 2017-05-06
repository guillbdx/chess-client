import {Component, OnInit} from '@angular/core';
import {User} from "../entities/user.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {SecurityService} from "../services/security.service";

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

    deployed = false;

    profile: User;

    constructor(
        private chessApiClient: ChessApiClientService,
        private security: SecurityService
    ) {}

    toggleNavContent() {
        this.deployed = ! this.deployed;
    }

    logout() {
        this.toggleNavContent();
        this.security.logout();
    }

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

}
