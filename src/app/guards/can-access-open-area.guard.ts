import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class CanAccessOpenAreaGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate() {
        if(localStorage.bearer != null) {
            this.router.navigate(['']);
            return false;
        }
        return true;
    }

}