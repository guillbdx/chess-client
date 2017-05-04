import {Component} from "@angular/core";
import {ApiResponseEntity} from "../entities/api-response.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";

@Component({
    selector: 'form-login',
    templateUrl: './login.form.component.html'
})
export class LoginFormComponent {

    model = {
        username: '',
        password: ''
    };

    constructor(private chessApiClient: ChessApiClientService) {}

    onSubmit() {

        this.chessApiClient.login(
            this.model.username,
            this.model.password
        ).then(function(apiResponse: ApiResponseEntity) {
            if(apiResponse.status == 200) {
                localStorage.bearer = apiResponse.content;
            }
        });

    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}