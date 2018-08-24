import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { Route } from '../../contracts/Route';

@Component({
  selector: 'app-dashboard-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class DashboardNavigationComponent {
  public readonly routes: Route[] = [
    {
      path: './',
      title: 'home',
      iconUrl: '/assets/vectors/home-solid.svg'
    },
    {
      path: './rooms',
      title: 'Play',
      iconUrl: '/assets/vectors/gamepad-solid.svg'
    },
    {
      path: './admin',
      title: 'Admin',
      iconUrl: '/assets/vectors/toolbox-solid.svg',
      isAdmin: true
    }
  ]
  constructor (public authService: AuthService) { }
}
