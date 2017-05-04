import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {FlashMessagesService} from "angular2-flash-messages";
import {ChessApiClientService} from "../services/chess-api-client.service";

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
        private _flashMessagesService: FlashMessagesService,
        private chessApiClient: ChessApiClientService
    ) {}

    onSubmit() {
        this.chessApiClient.changePassword(this.model.password)
            .then(response => {
                this.router.navigate(['profile']);
                setTimeout(() => {
                    this._flashMessagesService.show(
                        "Your password has been successfully updated.",
                        { cssClass: 'alert-success', timeout: 5000 });
                }, 100);
            });
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}