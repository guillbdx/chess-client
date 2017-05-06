import { Component, OnInit } from "@angular/core";
import { ChessApiClientService } from "../services/chess-api-client.service";
import {User} from "../entities/user.entity";
import {Router} from "@angular/router";
import {MyFlashMessagesService} from "../services/my-flash-messages.service";
import {SecurityService} from "../services/security.service";

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
        private myFlashMessages: MyFlashMessagesService,
        private security: SecurityService
    ) {}

    ngOnInit() {
        this.chessApiClient.getUsers(true, true)
            .then(response => {
                switch(response.status) {
                    case 200 :
                        this.possibleOpponents = response.json()._embedded.resources;
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                }
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
                        this.myFlashMessages.addSuccess('The game has been created. Waiting for opponent acceptation.');
                        break;
                    case 400 :
                        this.router.navigate(['']);
                        this.myFlashMessages.addError("A problem has occurred. We cannot comply with your request.");
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