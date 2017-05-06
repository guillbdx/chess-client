import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {LoaderService} from "../services/loader.service";
import {MyFlashMessagesService} from "../services/my-flash-messages.service";

@Component({
    selector: 'form-change-password',
    templateUrl: './change-password.form.component.html'
})
export class ChangePasswordFormComponent {

    model = {
        password: ''
    };

    constructor(
        private router: Router,
        private chessApiClient: ChessApiClientService,
        private loader: LoaderService,
        private myFlashMessages: MyFlashMessagesService
    ) {}

    onSubmit() {
        this.loader.show();
        this.chessApiClient.changePassword(this.model.password)
            .then(response => {
                this.router.navigate(['profile']);
                this.myFlashMessages.addSuccess("Your password has been updated.");
            });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}