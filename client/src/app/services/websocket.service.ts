import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { WebsocketMessage } from "../contracts/WebsocketMessage";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private readonly RETRY_TIMEOUT = 100

  public messages$: Subject<WebsocketMessage>
  private ws: WebSocket
  private messageQueue: string[]
  private connecting: boolean

  constructor (
    private authService: AuthService) {
    this.ws = new WebSocket(environment.getWebsocketPath())
    this.messages$ = new Subject<WebsocketMessage>()
    this.messageQueue = []
    this.connecting = true

    this.ws.onopen = this.onConnected.bind(this)
    this.ws.onclose = this.onClosed.bind(this)
    this.ws.onmessage = this.onMessage.bind(this)
  }

  send (message: string | WebsocketMessage) {
    if (typeof message === 'object') {
      if (!message.payload.token) {
        message.payload.token = this.authService.getToken()
      }

      message = JSON.stringify(message)
    }

    if (this.connecting) {
      this.messageQueue.push(message)
      this.trySendQueue()
    } else {
      this.ws.send(message)
    }
  }

  subscribe (resource: string, options?) {
    this.toggleSubscription(true, resource, options)
  }

  unsubscribe (resource: string, options?) {
    this.toggleSubscription(false, resource, options)
  }

  private onConnected () {
    this.connecting = false
    // send identity on connect
  }

  private onClosed () {
    if (!environment.production) {
      setTimeout(() => window.location.reload(), 100)
    }
    console.log('websocket closed')
  }

  private onMessage (message: MessageEvent) {
    this.messages$.next(JSON.parse(message.data))
  }

  private toggleSubscription (status: boolean, resource: string, options?) {
    let message = {
      resource,
      payload: {
        event: status ? 'subscribe' : 'unsubscribe',
        ...options
      }
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
