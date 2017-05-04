import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
    selector: 'form-game-vs-computer-create',
    templateUrl: './game-vs-computer-create.form.component.html'
})
export class GameVsComputerCreateFormComponent {

    possibleColors = [
        'White',
        'Black'
    ];

    model = {
        color: ''
    };

    constructor(
        private router: Router,
        private chessApiClient: ChessApiClientService,
        private _flashMessagesService: FlashMessagesService
    ) {}

    onSubmit() {
        let creatorIsWhite = true;
        if(this.model.color == 'Black') {
            creatorIsWhite = null;
        }
        this.chessApiClient.createGameVsComputer(
            creatorIsWhite
        ).then(game => {
            this.router.navigate(['game/' + game.id]);
        });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}