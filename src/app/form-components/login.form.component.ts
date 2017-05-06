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

    private handleInvalidCredentials(error: any): void {
        this.myFlashMessages.addError('Wrong credentials');
    }

    onSubmit() {
        this.chessApiClient.login(this.model.username, this.model.password)
            .then(response => {
                localStorage.bearer = response.json();
                this.router.navigate(['']);
            }).catch(error => this.handleInvalidCredentials(error));
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}