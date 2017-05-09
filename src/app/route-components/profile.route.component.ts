import {Component, OnInit} from '@angular/core';
import {User} from "../entities/entities/user.entity";
import {UserFactory} from "../entities/factories/user.factory";

@Component({
    templateUrl: './profile.route.component.html',
})
export class ProfileRouteComponent implements OnInit {

    profile: User;

    constructor(
        private userFactory: UserFactory
    ) {}

    ngOnInit() {
        this.userFactory.getProfile().then(profile => {
            this.profile = profile;
        });
    }

}