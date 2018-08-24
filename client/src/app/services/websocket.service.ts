import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";

import { WebsocketMessage } from "../contracts/WebsocketMessage";
import { environment } from "../../environments/environment";
import { AppState } from "../store/app.state";
import { User } from "../models/User";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private readonly RETRY_TIMEOUT = 100

  public messages$: Subject<WebsocketMessage>
  private ws: WebSocket
  private messageQueue: string[]
  private connecting: boolean
  private user: User

  constructor (private store: Store<AppState>) {
    this.ws = new WebSocket(environment.getWebsocketPath())
    this.messages$ = new Subject<WebsocketMessage>()
    this.messageQueue = []
    this.connecting = true

    this.store.select('user').subscribe(state => {
      this.user = state
    })

    this.ws.onopen = this.onConnected.bind(this)
    this.ws.onmessage = this.onMessage.bind(this)
  }

  send (message: string | object) {
    if (typeof message === 'object') message = JSON.stringify(message)

    if (this.connecting) {
      this.messageQueue.push(message)
      this.trySendQueue()
    } else {
      console.log('sending', message) // FIXME: remove
      this.ws.send(message)
    }
  }

  subscribe (resource: string) {
    this.toggleSubscription(true, resource)
  }

  unsubscribe (resource: string) {
    this.toggleSubscription(false, resource)
  }

  private onConnected () {
    this.connecting = false
    // send identity on connect
  }

  private onMessage (message: MessageEvent) {
    this.messages$.next(JSON.parse(message.data))
  }

  private toggleSubscription (status: boolean, resource: string) {
    let message = {
      resource,
      payload: { event: status ? 'subscribe' : 'unsubscribe' }
    }

    this.send(message)
  }

  private trySendQueue () {
    if (this.connecting) {
      setTimeout(() => this.trySendQueue(), this.RETRY_TIMEOUT)
    } else {
      while (this.messageQueue.length > 0) {
        let message = this.messageQueue.pop()
        this.send(message)
      }
    }
  }
}
