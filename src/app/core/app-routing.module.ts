import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginRouteComponent }          from '../route-components/login.route.component';
import { RegisterRouteComponent }       from '../route-components/register.route.component';
import { ProfileRouteComponent }        from '../route-components/profile.route.component';
import { GamesRouteComponent }          from '../route-components/games.route.component';
import { GameRouteComponent }           from '../route-components/game.route.component';
import { GameCreateRouteComponent }     from '../route-components/game-create.route.component';
import { ChangePasswordRouteComponent } from '../route-components/change-password.route.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginRouteComponent
  },
  {
    path: 'register',
    component: RegisterRouteComponent
  },
  {
    path: 'profile',
    component: ProfileRouteComponent
  },
  {
    path: 'games',
    component: GamesRouteComponent
  },
  {
    path: 'game/:id',
    component: GameRouteComponent
  },
  {
    path: 'game-create',
    component: GameCreateRouteComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordRouteComponent
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
