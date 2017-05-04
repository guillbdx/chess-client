import {Component} from "@angular/core";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";

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
        private _flashMessagesService: FlashMessagesService,
        private router: Router
    ) {}

    private handleInvalidCredentials(error: any): void {
        this._flashMessagesService.show(
            'Invalid credentials.',
            { cssClass: 'alert-danger', timeout: 5000 });
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