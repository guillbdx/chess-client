import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

    deployed = false;

    constructor(
        private router: Router
    ) {}

    toggleNavContent() {
        this.deployed = ! this.deployed;
    }

    logout() {
        localStorage.clear();
        this.toggleNavContent();
        this.router.navigate(['login']);
    }

}
