import { Component, OnInit } from "@angular/core";
import { ChessApiClientService } from "../services/chess-api-client.service";
import {User} from "../entities/user.entity";
import {Router} from "@angular/router";
import {LoaderService} from "../services/loader.service";
import {MyFlashMessagesService} from "../services/my-flash-messages.service";

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
        private loader: LoaderService,
        private myFlashMessages: MyFlashMessagesService
    ) {}

    ngOnInit() {
        this.loader.show();
        this.chessApiClient.getUsers(true, true)
            .then(users => {
                this.possibleOpponents = users;
                this.loader.hide();
            });
    }

    onSubmit() {
        this.loader.show();
        let creatorIsWhite = true;
        if(this.model.color == 'black') {
            creatorIsWhite = null;
        }
        this.chessApiClient.createGame(
            +this.model.opponent,
            creatorIsWhite
        ).then(game => {
            this.router.navigate(['']);
            this.myFlashMessages.addSuccess('The game has been created. Waiting for opponent acceptation.');
        });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}