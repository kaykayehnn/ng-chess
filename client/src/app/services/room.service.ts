import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import { WebsocketService } from "./websocket.service";
import { AppState } from "../store/app.state";
import { Subscription } from "rxjs";
import { Room } from "../models/Room";
import { AuthService } from "./auth.service";
import { FetchedRooms } from "../store/actions/room.actions";

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private subscription: Subscription
  constructor (
    private store: Store<AppState>,
    private websocketService: WebsocketService,
    private authService: AuthService) { }

  subscribe () {
    this.subscription = this.websocketService.messages$.subscribe((message) => {
      if (message.resource === 'rooms') {
        let rooms: Room[] = message.payload.map(JSON.parse)

        this.store.dispatch(new FetchedRooms(rooms))
      }
    })

    this.websocketService.subscribe('rooms')
  }

  unsubscribe () {
    this.subscription.unsubscribe()
    this.websocketService.unsubscribe('rooms')
  }

  createRoom (room: Room) {
    let message = {
      resource: 'rooms',
      payload: {
        event: 'add',
        token: this.authService.getToken(),
        room
      }
    }

    this.websocketService.send(message)
    // this.store.dispatch(new CreateRoom(room))
  }
}