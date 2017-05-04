import {Component} from "@angular/core";

@Component({
    selector: 'form-change-password',
    templateUrl: './change-password.form.component.html'
})
export class ChangePasswordFormComponent {

    model = {
        password: ''
    };

    onSubmit() {
        console.log(this.model);
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}