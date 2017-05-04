import { Component } from '@angular/core';

@Component({
    templateUrl: './game-create.route.component.html',
})
export class GameCreateRouteComponent {

    formVsComputerIsVisible = false;

    formVsUserIsVisible = false;

    displayFormVsComputer() {
        this.formVsComputerIsVisible = true;
        this.formVsUserIsVisible = false;
    }

    displayFormVsUser() {
        this.formVsComputerIsVisible = false;
        this.formVsUserIsVisible = true;
    }

};