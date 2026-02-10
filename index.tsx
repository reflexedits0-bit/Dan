

import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './src/app.component';
import { HomeComponent } from './src/components/home.component';
import { WalletComponent } from './src/components/wallet.component';
import { ProfileComponent } from './src/components/profile.component';
import { TournamentDetailComponent } from './src/components/tournament-detail.component';
import { MyTournamentsComponent } from './src/components/my-tournaments.component';
import { ShopComponent } from './src/components/shop.component';
import { ClanComponent } from './src/components/clan.component';
import { SupportComponent } from './src/components/support.component';
import { VipComponent } from './src/components/vip.component';
import { InfoComponent } from './src/components/info.component';
import { SentinelComponent } from './src/components/sentinel.component';
import { LeaderboardComponent } from './src/components/leaderboard.component';

const routes = [
  { path: '', component: HomeComponent },
  { path: 'tournament/:id', component: TournamentDetailComponent },
  { path: 'my-tournaments', component: MyTournamentsComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'clan', component: ClanComponent },
  { path: 'support', component: SupportComponent },
  { path: 'vip', component: VipComponent },
  { path: 'info/:type', component: InfoComponent },
  { path: 'sentinel', component: SentinelComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation())
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.