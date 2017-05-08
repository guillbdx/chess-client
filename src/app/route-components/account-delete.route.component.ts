import { Component } from '@angular/core';
import {ChessApiClientService} from "../services/chess-api-client.service";
import {SecurityService} from "../services/security.service";

@Component({
    templateUrl: './account-delete.route.component.html',
})
export class AccountDeleteRouteComponent {

    constructor(
        private chessApiClient: ChessApiClientService,
        private security: SecurityService
    ) {}

    deleteAccount() {

        this.chessApiClient.deleteAccount()
            .then(response => {
                this.security.logout();
            });

    }

}