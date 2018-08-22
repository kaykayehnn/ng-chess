import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import 'rxjs/add/operator/map'

import { StorageService } from "../services/storage.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor (private storage: StorageService) { }

  intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.storage.token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.storage.token}`
        }
      })
    }

    return next.handle(request).map(event => {
      if (event instanceof HttpResponse) {
        if (event.body.hasOwnProperty('token')) {
          let user = this.storage.save(event.body.token)

          event = event.clone({ body: user })
        }
      }

      return event
    })
  }
}