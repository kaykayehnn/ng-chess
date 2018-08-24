import { Component, Output, EventEmitter, Input } from '@angular/core'
import { Router } from '@angular/router';
import { User } from '../../models/User';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {
  public slideBackUp: boolean = false;

  @Output() private hide = new EventEmitter<MouseEvent | boolean>()

  slideUp (event) {
    if (event !== true && !event.target.classList.contains('absolute')) return

    this.slideBackUp = true;
    this.hide.emit(event)
  }
}
