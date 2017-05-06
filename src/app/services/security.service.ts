import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class SecurityService {

    constructor(
        private router: Router
    ) {}

    logout() {
        localStorage.clear();
        this.router.navigate(['login']);
    }

}