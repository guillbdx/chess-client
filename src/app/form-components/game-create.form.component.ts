import {Component} from "@angular/core";

@Component({
    selector: 'form-game-create',
    templateUrl: './game-create.form.component.html'
})
export class GameCreateFormComponent {

    possibleColors = [
        'White',
        'Black'
    ];

    possibleOpponents = [
        'Pierre',
        'Paul',
        'Jacques'
    ];

    model = {
        color: '',
        opponent: ''
    };

    onSubmit() {
        console.log(this.model);
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}