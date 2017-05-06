import {Component} from "@angular/core";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {ErrorsExtractorService} from "../services/errors-extractor.service";
import {I18nService} from "../services/i18n.service";
import {LoaderService} from "../services/loader.service";

@Component({
    selector: 'form-register',
    templateUrl: './register.form.component.html'
})
export class RegisterFormComponent {

    model = {
        username: '',
        email: '',
        password: ''
    };

    constructor(
        private _flashMessagesService: FlashMessagesService,
        private router: Router,
        private chessApiClient: ChessApiClientService,
        private errorsExtractor: ErrorsExtractorService,
        private i18n: I18nService,
        private loader: LoaderService
    ) {}

    private handleError(error: any): void {
        let errors = this.errorsExtractor.extract(error.json());
        this._flashMessagesService.show(
            errors[0],
            { cssClass: 'alert-danger', timeout: 5000 });
        this.loader.hide();
    }

    private loginAfterRegister(username: string, password: string) {
        this.chessApiClient.login(username, password)
            .then(response => {
                localStorage.bearer = response.json();
                this.router.navigate(['']);

                setTimeout(() => {
                    this._flashMessagesService.show(
                        this.i18n.translate("You are now signed up and logged in !"),
                        { cssClass: 'alert-success', timeout: 5000 });
                }, 100);
            });
    }

    onSubmit() {
        this.loader.show();
        this.chessApiClient.register(this.model.username, this.model.email, this.model.password)
            .then(response => {
                this.loginAfterRegister(this.model.username, this.model.password);
            }).catch(error => this.handleError(error));
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}