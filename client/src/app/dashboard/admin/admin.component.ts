import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { AdminState } from '../../store/state/admin.state';
import { User } from '../../models/User';
import { Game } from '../../models/Game';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  public state: AdminState
  public selected: string = 'users'

  constructor (
    private store: Store<AppState>,
    private adminService: AdminService) { }

  ngOnInit () {
    this.adminService.fetchUsers()
    this.adminService.fetchGames()

    this.store.select('admin').subscribe(state => {
      this.state = state
    })
  }

  saveUser (user: User) {
    this.adminService.editUser(user.id, user)
  }

  deleteUser (user: User) {
    this.adminService.deleteUser(user.id)
  }

  deleteGame (game: Game) {
    this.adminService.deleteGame(game.id)
  }
}
