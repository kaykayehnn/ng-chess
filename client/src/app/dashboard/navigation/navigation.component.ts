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
      iconUrl: 'assets/vectors/home-solid.svg'
    },
    {
      path: './rooms',
      title: 'Play',
      iconUrl: 'assets/vectors/gamepad-solid.svg'
    },
    {
      path: './admin',
      title: 'Admin',
      iconUrl: 'assets/vectors/toolbox-solid.svg',
      isAdmin: true
    },
    {
      path: './logout',
      title: 'Logout',
      iconUrl: 'assets/vectors/sign-out-alt-solid.svg'
    }
  ];

  constructor (public authService: AuthService) { }
}
