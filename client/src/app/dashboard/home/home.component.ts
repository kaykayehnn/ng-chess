import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js'

import { AppState } from '../../store/app.state';
import { HomeService } from './home.service';
import { DashboardState } from '../../store/state/dashboard.state';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  host: { '[style.flex]': '1' }
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  public state: DashboardState
  private subscription: Subscription

  constructor (
    private store: Store<AppState>,
    private homeService: HomeService) { }

  ngOnInit () {
    this.homeService.fetchStats()
    this.homeService.fetchLastMatches(5)

    this.subscription = this.store.select('dashboard')
      .subscribe(state => {
        this.state = state

        setTimeout(() => this.drawCharts(), 100)
      })
  }

  ngOnDestroy () {
    this.subscription.unsubscribe()
  }

  private drawCharts () {
    let ctx, parent
    let stats = this.state.stats
    let matches = this.state.lastMatches

    if (stats !== null && matches.length !== 0) {
      parent = document.querySelector('.wl-chart')
      ctx = document.getElementById('wl-chart')
      ctx.setAttribute('width', parent.offsetWidth)
      ctx.setAttribute('height', parent.offsetWidth)

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [stats.winCount, stats.lossCount],
              backgroundColor: ['#29B6F6', '#FF5722']
            }
          ],
          labels: ['Wins', 'Losses']
        },
        options: {
          // responsive: false
        }
      })

      parent = document.querySelector('.played-chart')
      ctx = document.getElementById('played-chart')
      ctx.setAttribute('width', parent.offsetWidth)
      ctx.setAttribute('height', parent.offsetWidth)

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [stats.winCount + stats.lossCount, stats.unfinishedCount],
              backgroundColor: ['#66BB6A', '#FF5722']
            }
          ],
          labels: ['Finished', 'In progress']
        },
        options: {
          responsive: false
        }
      })
    }
  }
}
