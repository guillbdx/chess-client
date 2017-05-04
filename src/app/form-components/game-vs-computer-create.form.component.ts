import {Component} from "@angular/core";

@Component({
    selector: 'form-game-vs-computer-create',
    templateUrl: './game-vs-computer-create.form.component.html'
})
export class GameVsComputerCreateFormComponent {

    possibleColors = [
        'White',
        'Black'
    ];

    model = {
        color: ''
    };

    onSubmit() {
        console.log(this.model);
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

}