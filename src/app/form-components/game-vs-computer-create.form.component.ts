import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {SecurityService} from "../services/security.service";
import {FlashMessagesService} from "../services/flash-messages.service";

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
        private security: SecurityService,
        private flashMessages: FlashMessagesService
    ) {

    }

    onSubmit() {
        let creatorIsWhite = true;
        if(this.model.color == 'black') {
            creatorIsWhite = null;
        }
        this.chessApiClient.createGameVsComputer(creatorIsWhite)
            .then(response => {
                switch(response.status) {
                    case 201 :
                        let game = response.json();
                        this.router.navigate(['game/' + game.id]);
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