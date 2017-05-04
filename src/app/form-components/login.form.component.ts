import {Component} from "@angular/core";
import {XhrRequesterService} from "../services/xhr-requester.service";

@Component({
    selector: 'form-login',
    templateUrl: './login.form.component.html'
})
export class LoginFormComponent {

    model = {
        username: '',
        password: ''
    };

    constructor(private xhrRequesterService: XhrRequesterService) {}

    onSubmit() {
        console.log(this.model);
        this.xhrRequesterService.request();
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}