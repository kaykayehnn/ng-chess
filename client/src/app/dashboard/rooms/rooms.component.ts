import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

// import {} from 'moment'
import { RoomService } from './room.service';
import { AppState } from '../../store/app.state';
import { Room } from '../../models/Room';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  host: { '[style.flex]': '1' }
})
export class DashboardRoomsComponent implements OnInit, OnDestroy {
  public rooms: Room[]
  public user: User
  public createdRoom: boolean
  public renderCount = 0 // used not to show empty state for a very short time
  // should wait until second render since first contains initial redux state

  constructor (
    private store: Store<AppState>,
    private roomService: RoomService,
    private authService: AuthService) { }

  ngOnInit () {
    this.roomService.subscribe()
    this.store.select('rooms').subscribe(state => {
      this.rooms = state
      this.renderCount++
      // ENHANCEMENT: add scale in/out animations
    })
    this.user = this.authService.getUser()
  }

  ngOnDestroy () {
    this.roomService.unsubscribe()
    if (this.createdRoom) {
      this.roomService.removeRoom()
    }
  }

  createRoom () {
    this.createdRoom = true
    this.roomService.createRoom()
  }

  joinRoom (room: Room) {
    this.roomService.joinRoom(room)
  }
}
