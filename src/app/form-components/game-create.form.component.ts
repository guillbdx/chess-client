import { Component, OnInit } from "@angular/core";
import { ChessApiClientService } from "../services/chess-api-client.service";
import {User} from "../entities/user.entity";
import {Router} from "@angular/router";
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
    selector: 'form-game-create',
    templateUrl: './game-create.form.component.html'
})
export class GameCreateFormComponent implements OnInit {

    possibleColors = [
        'White',
        'Black'
    ];

    possibleOpponents: User[];

    model = {
        color: '',
        opponent: ''
    };

    constructor(
        private chessApiClient: ChessApiClientService,
        private router: Router,
        private _flashMessagesService: FlashMessagesService
    ) {}

    ngOnInit() {
        this.chessApiClient.getUsers(true, true, 1, 1000)
            .then(users => {
                this.possibleOpponents = users;
            });
    }

    onSubmit() {
        let creatorIsWhite = true;
        if(this.model.color == 'Black') {
            creatorIsWhite = null;
        }
        this.chessApiClient.createGame(
            +this.model.opponent,
            creatorIsWhite
        ).then(response => {
            this.router.navigate(['']);
            setTimeout(() => {
                this._flashMessagesService.show(
                    "The game has been created. It will start when your opponent will have accepted the invitation.",
                    { cssClass: 'alert-success', timeout: 5000 });
            }, 100);
        });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}