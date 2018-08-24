import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardHomeComponent } from './dashboard/home/home.component';
import { DashboardRoomsComponent } from './dashboard/rooms/rooms.component';
import { AuthGuard } from './auth/auth.guard';
import { NoAuthGuard } from './auth/noauth.guard';
import { DashboardAdminComponent } from './dashboard/admin/admin.component';

// FIXME: handle redirecting from landing if logged in
const routes: Routes = [
  {
    path: '', canActivate: [NoAuthGuard], children: [
      { path: '', component: LandingComponent },
      { path: 'signin', component: LandingComponent }
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      {
        path: '',
        component: DashboardHomeComponent
      },
      {
        path: 'rooms',
        component: DashboardRoomsComponent
      },
      {
        path: 'admin',
        component: DashboardAdminComponent
      }
    ]
  },
  { path: '**', redirectTo: '' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
