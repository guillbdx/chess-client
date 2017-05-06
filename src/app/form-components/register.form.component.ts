import {Component} from "@angular/core";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {ErrorsExtractorService} from "../services/errors-extractor.service";
import {I18nService} from "../services/i18n.service";
import {LoaderService} from "../services/loader.service";
import {MyFlashMessagesService} from "../services/my-flash-messages.service";

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
        private router: Router,
        private chessApiClient: ChessApiClientService,
        private errorsExtractor: ErrorsExtractorService,
        private loader: LoaderService,
        private myFlashMessages: MyFlashMessagesService
    ) {}

    private handleError(error: any): void {
        let errors = this.errorsExtractor.extract(error.json());
        this.myFlashMessages.addError(errors[0]);
        this.loader.hide();
    }

    private loginAfterRegister(username: string, password: string) {
        this.chessApiClient.login(username, password)
            .then(response => {
                localStorage.bearer = response.json();
                this.router.navigate(['']);
                this.myFlashMessages.addSuccess("You are now signed up and logged in !");
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