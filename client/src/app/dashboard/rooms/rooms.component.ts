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
  public rooms: Room[];
  public user: User;
  public createdRoom: boolean;
  public renderCount = 0; // used not to show empty state for a very short time
  // should wait until second render since first contains initial redux state
  public chrome: boolean;

  constructor (
    private store: Store<AppState>,
    private roomService: RoomService,
    private authService: AuthService) { }

  ngOnInit () {
    this.roomService.subscribe();
    this.store.select('rooms').subscribe(state => {
      this.rooms = state;
      this.renderCount++;
      // ENHANCEMENT: add scale in/out animations
    });
    this.user = this.authService.getUser();

    this.chrome = this.isChrome();
  }

  isChrome () {
    // please note,
    // that IE11 now returns undefined again for window.chrome
    // and new Opera 30 outputs true for window.chrome
    // but needs to check if window.opr is not undefined
    // and new IE Edge outputs to true now for window.chrome
    // and if not iOS Chrome check
    // so use the below updated condition

    const windowAny = window as any;

    const isChromium = windowAny.chrome;
    const winNav = window.navigator;
    const vendorName = winNav.vendor;
    const isOpera = typeof windowAny.opr !== 'undefined';
    const isIEedge = winNav.userAgent.indexOf('Edge') > -1;
    const isIOSChrome = winNav.userAgent.match('CriOS');

    if (isIOSChrome) {
      // is Google Chrome on IOS
      return true;
    } else if (
      isChromium !== null &&
      typeof isChromium !== 'undefined' &&
      vendorName === 'Google Inc.' &&
      isOpera === false &&
      isIEedge === false
    ) {
      return true;
      // is Google Chrome
    } else {
      return false;
      // not Google Chrome
    }
  }

  ngOnDestroy () {
    this.roomService.unsubscribe();
    if (this.createdRoom) {
      this.roomService.removeRoom();
    }
  }

  createRoom () {
    this.createdRoom = true;
    this.roomService.createRoom();
  }

  joinRoom (room: Room) {
    this.roomService.joinRoom(room);
  }
}
