import {Component} from "@angular/core";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";
import {I18nService} from "../services/i18n.service";
import {LoaderService} from "../services/loader.service";

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
        private router: Router,
        private i18n: I18nService,
        private loader: LoaderService
    ) {}

    private handleInvalidCredentials(error: any): void {
        this._flashMessagesService.show(
            this.i18n.translate('Wrong credentials'),
            { cssClass: 'alert-danger', timeout: 5000 });
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