import {Component} from "@angular/core";
import {ApiResponseEntity} from "../entities/api-response.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";
import {FlashMessagesService} from "angular2-flash-messages";

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
        private _flashMessagesService: FlashMessagesService
    ) {}

    onSubmit() {

        let that = this;

        this.chessApiClient.login(
            this.model.username,
            this.model.password
        ).then(function(apiResponse: ApiResponseEntity) {

            that._flashMessagesService.show(
                'We are in about component!',
                { cssClass: 'alert-success', timeout: 5000 });


            if(apiResponse.status == 200) {
                localStorage.bearer = apiResponse.content;
            }
        });

    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}