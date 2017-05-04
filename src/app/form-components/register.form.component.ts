import {Component} from "@angular/core";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {ErrorsExtractorService} from "../services/errors-extractor.service";

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
        private errorsExtractor: ErrorsExtractorService
    ) {}

    private handleError(error: any): void {
        let errors = this.errorsExtractor.extract(error.json());
        this._flashMessagesService.show(
            errors[0],
            { cssClass: 'alert-danger', timeout: 5000 });
    }

    private loginAfterRegister(username: string, password: string) {
        this.chessApiClient.login(username, password)
            .then(response => {
                localStorage.bearer = response.json();
                this.router.navigate(['']);
            });
    }

    onSubmit() {
        this.chessApiClient.register(this.model.username, this.model.email, this.model.password)
            .then(response => {
                this.loginAfterRegister(this.model.username, this.model.password);
            }).catch(error => this.handleError(error));
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}