import {Component} from "@angular/core";

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

    onSubmit() {
        console.log(this.model);
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}