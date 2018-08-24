import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
// import {} from 'moment'
import { RoomService } from '../../services/room.service';
import { AppState } from '../../store/app.state';
import { Room } from '../../models/Room';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  host: { '[style.flex]': '1' }
})
export class DashboardRoomsComponent implements OnInit, OnDestroy {
  public rooms: Room[]
  public createdRoom: boolean

  constructor (
    private store: Store<AppState>,
    private roomService: RoomService,
    private authService: AuthService) { }

  ngOnInit () {
    this.roomService.subscribe()
    this.store.select('rooms').subscribe(state => {
      this.rooms = state
      // ENHANCEMENT: add scale in/out animations
    })
  }

  ngOnDestroy () {
    this.roomService.unsubscribe()
  }

  createRoom () {
    let room: Room = {
      host: this.authService.getUser(),
      timestamp: Date.now()
    }

    this.createdRoom = true
    this.roomService.createRoom(room)
  }
}
