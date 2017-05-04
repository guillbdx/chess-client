import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';
import { FormsModule }      from '@angular/forms';
import { HttpModule }       from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent }     from './app.component';

import { LoginRouteComponent }          from './route-components/login.route.component';
import { RegisterRouteComponent }       from './route-components/register.route.component';
import { ProfileRouteComponent }        from './route-components/profile.route.component';
import { GamesRouteComponent }          from './route-components/games.route.component';
import { GameRouteComponent }           from './route-components/game.route.component';
import { GameCreateRouteComponent }     from './route-components/game-create.route.component';
import { ChangePasswordRouteComponent } from './route-components/change-password.route.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
      AppComponent,
    LoginRouteComponent,
    RegisterRouteComponent,
    ProfileRouteComponent,
    GamesRouteComponent,
    GameRouteComponent,
    GameCreateRouteComponent,
    ChangePasswordRouteComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
