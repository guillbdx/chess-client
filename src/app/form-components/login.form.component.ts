import {Component} from "@angular/core";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {Router} from "@angular/router";
import {LoaderService} from "../services/loader.service";
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
        private loader: LoaderService,
        private myFlashMessages: MyFlashMessagesService
    ) {}

    private handleInvalidCredentials(error: any): void {
        this.myFlashMessages.addError('Wrong credentials');
        this.loader.hide();
    }

    onSubmit() {
        this.loader.show();
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