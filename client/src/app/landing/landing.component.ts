import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, interval, TeardownLogic, Observer } from 'rxjs';
import * as Chess from 'chess.js'

import { ChessMove } from '../contracts/ChessMove';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  public readonly ANIMATION_LENGTH = 800

  public showModal: boolean
  public slideOut: boolean
  public chessMoves$: Observable<ChessMove>
  private chess

  constructor (
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit () {
    let urlSegment = this.route.snapshot.url[0]
    this.showModal = urlSegment && urlSegment.path === 'signin'

    this.chess = new Chess()
    this.chessMoves$ = new Observable<ChessMove>(this.makeRandomMove.bind(this))
  }

  makeRandomMove (observer: Observer<ChessMove>): TeardownLogic {
    let subscription = interval(1500).subscribe(() => {
      let moves: ChessMove[] = this.chess.moves({ verbose: true })
      if (this.chess.in_checkmate() || this.chess.in_draw() || this.chess.in_stalemate()) {
        return observer.complete()
      }

      let selectedMove = moves.reduce((p, c) => c.flags.indexOf('c') >= 0 || c.san.match(/(#|\+)$/) ? c : p)

      if (selectedMove.flags.indexOf('c') < 0 && !selectedMove.san.match(/(#|\+)$/)) {
        selectedMove = moves[Math.floor(moves.length * Math.random())]
      }

      let moveObj = this.chess.move(selectedMove)
      observer.next(moveObj)
    })

    return subscription
  }

  hideModal (event) {
    if (event === true) {
      this.slideOut = true
      setTimeout(() => this.router.navigateByUrl('/dashboard/rooms'), this.ANIMATION_LENGTH * 2)
    }

    setTimeout(() => this.showModal = false, this.ANIMATION_LENGTH)
  }
}
