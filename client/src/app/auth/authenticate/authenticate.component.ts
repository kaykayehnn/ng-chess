import { Component, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent {
  public slideBackUp: boolean = false;

  @Output() private hide = new EventEmitter<void>()

  slideUp (event) {
    if (event !== true && !event.target.classList.contains('absolute')) return

    this.slideBackUp = true;
    event.target
    setTimeout(() => this.hide.emit(), 800)
  }
}
