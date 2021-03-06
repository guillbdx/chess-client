import { BrowserModule }                    from '@angular/platform-browser';
import { NgModule }                         from '@angular/core';
import { FormsModule }                      from '@angular/forms';
import { HttpModule }                       from '@angular/http';
import { AppRoutingModule }                 from './app-routing.module';

import {LanguageDetectorService}            from "../services/language-detector.service";
import {ChessApiClientService}              from "../services/chess-api-client.service";
import {ErrorsExtractorService}             from "../services/errors-extractor.service";
import {I18nService}                        from "../services/i18n.service";
import {LoaderService}                      from "../services/loader.service";
import {FlashMessagesService}               from "../services/flash-messages.service";
import {SecurityService}                    from "../services/security.service";

import { GameFactory }                      from "../entities/factories/game.factory";
import { UserFactory }                      from "../entities/factories/user.factory";
import { MoveFactory }                      from "../entities/factories/move.factory";

import {CanAccessPrivateAreaGuard}          from "../guards/can-access-private-area.guard";
import {CanAccessOpenAreaGuard}             from "../guards/can-access-open-area.guard";

import { AppComponent }                     from './app.component';
import { NavigationComponent }              from "./navigation.component";
import { GameComponent }                    from "../game/game.component";
import { SharedGameComponent }              from "../game/shared-game.component";

import { LoginRouteComponent }              from '../route-components/login.route.component';
import { RegisterRouteComponent }           from '../route-components/register.route.component';
import { ProfileRouteComponent }            from '../route-components/profile.route.component';
import { GamesRouteComponent }              from '../route-components/games.route.component';
import { GameRouteComponent }               from '../route-components/game.route.component';
import { SharedGameRouteComponent }         from "../route-components/shared-game.route.component";
import { GameCreateRouteComponent }         from '../route-components/game-create.route.component';
import { ChangePasswordRouteComponent }     from '../route-components/change-password.route.component';
import { AccountDeleteRouteComponent}       from "../route-components/account-delete.route.component";

import {ChangePasswordFormComponent}        from "../form-components/change-password.form.component";
import {LoginFormComponent}                 from "../form-components/login.form.component";
import {RegisterFormComponent}              from "../form-components/register.form.component";
import {GameVsComputerCreateFormComponent}  from "../form-components/game-vs-computer-create.form.component";
import {GameCreateFormComponent}            from "../form-components/game-create.form.component";

import { TranslatePipe }                    from "../pipes/translate.pipe";
import { FormatDatePipe }                   from "../pipes/format-date.pipe";
import { SquareTonePipe }                   from "../pipes/square-tone.pipe";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        NavigationComponent,

        LoginRouteComponent,
        RegisterRouteComponent,
        ProfileRouteComponent,
        GamesRouteComponent,
        GameRouteComponent,
        SharedGameRouteComponent,
        GameCreateRouteComponent,
        ChangePasswordRouteComponent,
        AccountDeleteRouteComponent,

        ChangePasswordFormComponent,
        LoginFormComponent,
        RegisterFormComponent,
        GameVsComputerCreateFormComponent,
        GameCreateFormComponent,

        GameComponent,
        SharedGameComponent,

        TranslatePipe,
        FormatDatePipe,
        SquareTonePipe
    ],
    providers: [
        CanAccessPrivateAreaGuard,
        CanAccessOpenAreaGuard,
        LanguageDetectorService,
        ChessApiClientService,
        ErrorsExtractorService,
        I18nService,
        LoaderService,
        FlashMessagesService,
        SecurityService,
        GameFactory,
        UserFactory,
        MoveFactory
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
