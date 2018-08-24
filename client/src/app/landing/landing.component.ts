import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  public readonly ANIMATION_LENGTH = 800
  public showModal: boolean
  public slideOut: boolean

  constructor (
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit () {
    let urlSegment = this.route.snapshot.url[0]
    this.showModal = urlSegment && urlSegment.path === 'signin'
  }

  hideModal (event) {
    if (event === true) {
      this.slideOut = true
      setTimeout(() => this.router.navigateByUrl('dashboard'), this.ANIMATION_LENGTH * 2)
      // stays on top for a bit as if work is happening and then majestically slides down
    }

    setTimeout(() => this.showModal = false, this.ANIMATION_LENGTH)
  }
}
