import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class CanAccessPrivateAreaGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate() {
        if(localStorage.bearer == null) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }

}