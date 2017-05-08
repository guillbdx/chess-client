import { NgModule }                     from '@angular/core';
import { RouterModule, Routes }         from '@angular/router';

import {CanAccessPrivateAreaGuard}      from "../guards/can-access-private-area.guard";
import {CanAccessOpenAreaGuard}         from "../guards/can-access-open-area.guard";

import { LoginRouteComponent }          from '../route-components/login.route.component';
import { RegisterRouteComponent }       from '../route-components/register.route.component';
import { ProfileRouteComponent }        from '../route-components/profile.route.component';
import { GamesRouteComponent }          from '../route-components/games.route.component';
import { GameRouteComponent }           from '../route-components/game.route.component';
import { GameCreateRouteComponent }     from '../route-components/game-create.route.component';
import { ChangePasswordRouteComponent } from '../route-components/change-password.route.component';
import { AccountDeleteRouteComponent }  from '../route-components/account-delete.route.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginRouteComponent,
        canActivate: [
            CanAccessOpenAreaGuard
        ]
    },
    {
        path: 'register',
        component: RegisterRouteComponent,
        canActivate: [
            CanAccessOpenAreaGuard
        ]
    },
    {
        path: '',
        component: GamesRouteComponent,
        canActivate: [
            CanAccessPrivateAreaGuard
        ]
    },
    {
        path: 'profile',
        component: ProfileRouteComponent,
        canActivate: [
            CanAccessPrivateAreaGuard
        ]
    },
    {
        path: 'game/:id',
        component: GameRouteComponent,
        canActivate: [
            CanAccessPrivateAreaGuard
        ]
    },
    {
        path: 'game-create',
        component: GameCreateRouteComponent,
        canActivate: [
            CanAccessPrivateAreaGuard
        ]
    },
    {
        path: 'change-password',
        component: ChangePasswordRouteComponent,
        canActivate: [
            CanAccessPrivateAreaGuard
        ]
    },
    {
        path: 'account-delete',
        component: AccountDeleteRouteComponent,
        canActivate: [
            CanAccessPrivateAreaGuard
        ]
    },
    ];

    @NgModule({
        imports: [ RouterModule.forRoot(routes) ],
        exports: [ RouterModule ]
    })
export class AppRoutingModule {}
