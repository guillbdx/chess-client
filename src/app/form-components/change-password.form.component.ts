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
        private myFlashMessages: MyFlashMessagesService
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

                        break;
                    case 401 :

                        break;
                }

            });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}