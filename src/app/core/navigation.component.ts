import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../entities/user.entity";
import {ChessApiClientService} from "../services/chess-api-client.service";

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

    deployed = false;

    profile: User;

    constructor(
        private router: Router,
        private chessApiClient: ChessApiClientService
    ) {}

    toggleNavContent() {
        this.deployed = ! this.deployed;
    }

    logout() {
        localStorage.clear();
        this.toggleNavContent();
        this.router.navigate(['login']);
    }

    ngOnInit() {
        this.chessApiClient.getProfile()
            .then(user => {
                this.profile = user;
                console.log(this.profile);
            });
    }

}
