import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { NavigationRoute } from '../../contracts/NavigationRoute';

@Component({
  selector: 'app-dashboard-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class DashboardNavigationComponent {
  public readonly routes: NavigationRoute[] = [
    {
      path: './',
      title: 'Home',
      iconUrl: '/assets/vectors/home-solid.svg'
    },
    {
      path: './rooms',
      title: 'Play',
      iconUrl: '/assets/vectors/gamepad-solid.svg'
    },
    // {
    //   path: './spectate',
    //   title: 'Spectate',
    //   iconUrl: '/assets/vectors/tv-solid.svg',
    //   class: 'live'
    // },
    {
      path: './admin',
      title: 'Admin',
      iconUrl: '/assets/vectors/toolbox-solid.svg',
      isAdmin: true
    }
  ]
  constructor (public authService: AuthService) { }
}
