import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import {CanAccessPrivateAreaGuard}  from "../guards/can-access-private-area.guard";
import {XhrRequesterService}        from "../services/xhr-requester.service";
import {LanguageDetectorService}    from "../services/language-detector.service";

import { AppComponent }         from './app.component';
import {NavigationComponent}    from "./navigation.component";

import { LoginRouteComponent }          from '../route-components/login.route.component';
import { RegisterRouteComponent }       from '../route-components/register.route.component';
import { ProfileRouteComponent }        from '../route-components/profile.route.component';
import { GamesRouteComponent }          from '../route-components/games.route.component';
import { GameRouteComponent }           from '../route-components/game.route.component';
import { GameCreateRouteComponent }     from '../route-components/game-create.route.component';
import { ChangePasswordRouteComponent } from '../route-components/change-password.route.component';

import {ChangePasswordFormComponent}        from "../form-components/change-password.form.component";
import {LoginFormComponent}                 from "../form-components/login.form.component";
import {RegisterFormComponent}              from "../form-components/register.form.component";
import {GameVsComputerCreateFormComponent}  from "../form-components/game-vs-computer-create.form.component";
import {GameCreateFormComponent}            from "../form-components/game-create.form.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        NavigationComponent,

        LoginRouteComponent,
        RegisterRouteComponent,
        ProfileRouteComponent,
        GamesRouteComponent,
        GameRouteComponent,
        GameCreateRouteComponent,
        ChangePasswordRouteComponent,

        ChangePasswordFormComponent,
        LoginFormComponent,
        RegisterFormComponent,
        GameVsComputerCreateFormComponent,
        GameCreateFormComponent
    ],
    providers: [
        CanAccessPrivateAreaGuard,
        LanguageDetectorService,
        XhrRequesterService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
