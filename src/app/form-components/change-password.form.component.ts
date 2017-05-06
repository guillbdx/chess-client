import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {LoaderService} from "../services/loader.service";
import {MyFlashMessagesService} from "../services/my-flash-messages.service";
import {SecurityService} from "../services/security.service";

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
        private myFlashMessages: MyFlashMessagesService,
        private security: SecurityService
    ) {}

    onSubmit() {
        this.chessApiClient.changePassword(this.model.password)
            .then(response => {

                switch(response.status) {
                    case 204 :
                        this.router.navigate(['profile']);
                        this.myFlashMessages.addSuccess("Your password has been updated.");
                        break;
                    case 400 :
                        this.router.navigate(['profile']);
                        this.myFlashMessages.addError("A problem has occurred. We cannot comply with your request.");
                        break;
                    case 401 :
                        this.security.logout();
                        break;
                }

            });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}