import {Component} from "@angular/core";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {Router} from "@angular/router";
import {FlashMessagesService} from "../services/flash-messages.service";

@Component({
    selector: 'form-login',
    templateUrl: './login.form.component.html'
})
export class LoginFormComponent {

    model = {
        username: '',
        password: ''
    };

    constructor(
        private chessApiClient: ChessApiClientService,
        private router: Router,
        private flashMessages: FlashMessagesService
    ) {}

    onSubmit() {
        this.chessApiClient.login(this.model.username, this.model.password)
            .then(response => {
                switch(response.status) {
                    case 200 :
                        localStorage.bearer = response.json();
                        this.router.navigate(['']);
                        this.flashMessages.displayMessages();
                        break;
                    case 401 :
                        this.flashMessages.addError('Wrong credentials');
                        break;
                }
            });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}