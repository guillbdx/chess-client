import {Component} from "@angular/core";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {Router} from "@angular/router";
import {MyFlashMessagesService} from "../services/my-flash-messages.service";

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
        private myFlashMessages: MyFlashMessagesService
    ) {}

    onSubmit() {
        this.chessApiClient.login(this.model.username, this.model.password)
            .then(response => {
                switch(response.status) {
                    case 200 :
                        localStorage.bearer = response.json();
                        this.router.navigate(['']);
                        break;
                    case 401 :
                        this.myFlashMessages.addError('Wrong credentials');
                        break;
                }
            });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}