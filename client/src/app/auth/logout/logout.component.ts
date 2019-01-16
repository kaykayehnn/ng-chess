import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {

  constructor (
    private authService: AuthService,
    private router: Router) { }

  ngOnInit () {
    console.log('logging out');
    this.authService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigateByUrl('/');
    });
  }
}
