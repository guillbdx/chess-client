import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {I18nService} from "../services/i18n.service";
import {LoaderService} from "../services/loader.service";

@Component({
    selector: 'form-game-vs-computer-create',
    templateUrl: './game-vs-computer-create.form.component.html'
})
export class GameVsComputerCreateFormComponent {

    model = {
        color: ''
    };

    constructor(
        private router: Router,
        private chessApiClient: ChessApiClientService,
        private loader: LoaderService
    ) {

    }

    onSubmit() {
        this.loader.show();
        let creatorIsWhite = true;
        if(this.model.color == 'black') {
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