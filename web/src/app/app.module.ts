import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { HomeComponent } from './components/home/home.component';

import { ApiService } from './services/api.service';
import { TradeComponent } from './components/trade/trade.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { SettingsComponent } from './components/settings/settings.component';

const appRoutes: Routes = [
  {path:'',component:HomeComponent},
  {path:'user',component:UserComponent},
  {path:'trade',component:TradeComponent},
  {path:'trade/:coinId',component:TradeComponent},
  {path:'profile',component:ProfileComponent},
  {path:'leaderboard',component:LeaderboardComponent},
  {path:'settings',component:SettingsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomeComponent,
    TradeComponent,
    ProfileComponent,
    LeaderboardComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
