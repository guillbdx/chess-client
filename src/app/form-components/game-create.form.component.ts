import { Component, OnInit } from "@angular/core";
import { ChessApiClientService } from "../services/chess-api-client.service";
import {User} from "../entities/entities/user.entity";
import {Router} from "@angular/router";
import {FlashMessagesService} from "../services/flash-messages.service";
import {SecurityService} from "../services/security.service";
import {UserFactory} from "../entities/factories/user.factory";

@Component({
    selector: 'form-game-create',
    templateUrl: './game-create.form.component.html'
})
export class GameCreateFormComponent implements OnInit {

    possibleOpponents: User[];

    model = {
        color: '',
        opponent: ''
    };

    constructor(
        private chessApiClient: ChessApiClientService,
        private router: Router,
        private flashMessages: FlashMessagesService,
        private security: SecurityService,
        private userFactory: UserFactory
    ) {}

    ngOnInit() {
        this.userFactory.getUsers(true, true).then(response => {
            this.possibleOpponents = response;
        });
    }

    onSubmit() {
        let creatorIsWhite = true;
        if(this.model.color == 'black') {
            creatorIsWhite = null;
        }
        this.chessApiClient.createGame(+this.model.opponent,creatorIsWhite)
            .then(response => {
                switch(response.status) {
                    case 201 :
                        this.router.navigate(['']);
                        this.flashMessages.addSuccess('The game has been created. Waiting for opponent acceptation.');
                        break;
                    case 400 :
                        this.router.navigate(['']);
                        this.flashMessages.addError("A problem has occurred. We cannot comply with your request.");
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                }
        });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}