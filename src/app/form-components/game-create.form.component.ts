import { Component, OnInit } from "@angular/core";
import { ChessApiClientService } from "../services/chess-api-client.service";
import {User} from "../entities/user.entity";
import {Router} from "@angular/router";
import {FlashMessagesService} from "angular2-flash-messages";
import {I18nService} from "../services/i18n.service";
import {LoaderService} from "../services/loader.service";

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
        private _flashMessagesService: FlashMessagesService,
        private i18n: I18nService,
        private loader: LoaderService
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
            setTimeout(() => {
                this._flashMessagesService.show(
                    this.i18n.translate('The game has been created. Waiting for opponent acceptation.'),
                    { cssClass: 'alert-success', timeout: 5000 });
            }, 100);
        });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}