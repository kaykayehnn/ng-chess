import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { WebsocketService } from '../../services/websocket.service';
import { AppState } from '../../store/app.state';
import { Subscription } from 'rxjs';
import { Room } from '../../models/Room';
import { AuthService } from '../../services/auth.service';
import { FetchedRooms } from '../../store/actions/room.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private subscription: Subscription;
  constructor (
    private store: Store<AppState>,
    private websocketService: WebsocketService,
    private authService: AuthService,
    private router: Router) { }

  subscribe () {
    this.subscription = this.websocketService.messages$.subscribe((message) => {
      if (message.resource === 'rooms') {
        const rooms: Room[] = message.payload.map(JSON.parse);

        this.store.dispatch(new FetchedRooms(rooms));
      } else if (message.resource === 'game') {
        const url = `/dashboard/game/${message.payload.gameId}`;

        this.router.navigateByUrl(url);
      }
    });

    this.websocketService.subscribe('rooms');
  }

  unsubscribe () {
    this.subscription.unsubscribe();
    this.websocketService.unsubscribe('rooms');
  }

  createRoom () {
    this.toggleOwnRoom(true);
  }

  removeRoom () {
    this.toggleOwnRoom(false);
  }

  joinRoom (room: Room) {
    const message = {
      resource: 'rooms',
      payload: {
        event: 'join',
        room
      }
    };

    this.websocketService.send(message);
  }

  private toggleOwnRoom (status: boolean) {
    const message = {
      resource: 'rooms',
      payload: {
        event: status ? 'add' : 'remove'
      }
    };

    this.websocketService.send(message);
  }
}
