import {Component} from "@angular/core";

@Component({
    selector: 'form-login',
    templateUrl: './login.form.component.html'
})
export class LoginFormComponent {

    model = {
        username: '',
        password: ''
    };

    onSubmit() {
        console.log(this.model);
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}