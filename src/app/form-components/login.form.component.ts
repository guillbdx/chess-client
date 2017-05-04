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
            if(apiResponse.status == 200) {
                localStorage.bearer = apiResponse.content;
            }
            if(apiResponse.status == 401) {
                that._flashMessagesService.show(
                    'Invalid credentials.',
                    { cssClass: 'alert-danger', timeout: 5000 });
            }
        });

    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}