import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {ErrorsExtractorService} from "../services/errors-extractor.service";
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
        private myFlashMessages: MyFlashMessagesService
    ) {}

    private loginAfterRegister(username: string, password: string) {
        this.chessApiClient.login(username, password)
            .then(response => {
                localStorage.bearer = response.json();
                this.router.navigate(['']);
                this.myFlashMessages.addSuccess("You are now signed up and logged in !");
            });
    }

    onSubmit() {
        this.chessApiClient.register(this.model.username, this.model.email, this.model.password)
            .then(response => {
                switch(response.status) {
                    case 201 :
                        this.loginAfterRegister(this.model.username, this.model.password);
                        break;
                    case 400 :
                        let errors = this.errorsExtractor.extract(response.json());
                        this.myFlashMessages.addError(errors[0]);
                        break;
                }
            });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}