import {Component, OnInit} from '@angular/core';
import {User} from "../entities/entities/user.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {SecurityService} from "../services/security.service";
import {FlashMessagesService} from "../services/flash-messages.service";
import {UserFactory} from "../entities/factories/user.factory";

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

    deployed = false;

    profile: User;

    constructor(
        private security: SecurityService,
        private flashMessages: FlashMessagesService,
        private userFactory: UserFactory
    ) {}

    toggleNavContent() {
        this.deployed = ! this.deployed;
    }

    logout() {
        this.toggleNavContent();
        this.security.logout();
        this.flashMessages.displayMessages();
    }

    ngOnInit() {

        this.userFactory.getProfile().then(response => {
            this.profile = response;
        });

    }

}
