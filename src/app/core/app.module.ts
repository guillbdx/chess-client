import { BrowserModule }                    from '@angular/platform-browser';
import { NgModule }                         from '@angular/core';
import { FormsModule }                      from '@angular/forms';
import { HttpModule }                       from '@angular/http';
import { AppRoutingModule }                 from './app-routing.module';
import { FlashMessagesModule }              from "angular2-flash-messages";

import {Configuration}                      from "../Configuration";
import {LanguageDetectorService}            from "../services/language-detector.service";
import {ChessApiClientService}              from "../services/chess-api-client.service";
import {ErrorsExtractorService}             from "../services/errors-extractor.service";
import {I18nService}                        from "../services/i18n.service";
import {LoaderService}                      from "../services/loader.service";

import {CanAccessPrivateAreaGuard}          from "../guards/can-access-private-area.guard";
import {CanAccessOpenAreaGuard}             from "../guards/can-access-open-area.guard";

import { AppComponent }                     from './app.component';
import {NavigationComponent}                from "./navigation.component";

import { LoginRouteComponent }              from '../route-components/login.route.component';
import { RegisterRouteComponent }           from '../route-components/register.route.component';
import { ProfileRouteComponent }            from '../route-components/profile.route.component';
import { GamesRouteComponent }              from '../route-components/games.route.component';
import { GameRouteComponent }               from '../route-components/game.route.component';
import { GameCreateRouteComponent }         from '../route-components/game-create.route.component';
import { ChangePasswordRouteComponent }     from '../route-components/change-password.route.component';

import {ChangePasswordFormComponent}        from "../form-components/change-password.form.component";
import {LoginFormComponent}                 from "../form-components/login.form.component";
import {RegisterFormComponent}              from "../form-components/register.form.component";
import {GameVsComputerCreateFormComponent}  from "../form-components/game-vs-computer-create.form.component";
import {GameCreateFormComponent}            from "../form-components/game-create.form.component";

import {TranslatePipe}                      from "../pipes/translate.pipe";
import {FormatDatePipe}                     from "../pipes/format-date.pipe";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        FlashMessagesModule
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
        GameCreateFormComponent,

        TranslatePipe,
        FormatDatePipe
    ],
    providers: [
        Configuration,
        CanAccessPrivateAreaGuard,
        CanAccessOpenAreaGuard,
        LanguageDetectorService,
        ChessApiClientService,
        ErrorsExtractorService,
        I18nService,
        LoaderService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
