import { Injectable } from '@angular/core';
import { Observable, timer, interval, Subject, Subscription } from 'rxjs';
import { isNullOrUndefined } from 'util';

const tickRate = 127;

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  tick: Subject<number> = new Subject();

  private _timerSubscription: Subscription;



  constructor() { }

  startGame() {
    if (!isNullOrUndefined(this._timerSubscription)) {
      this._timerSubscription.unsubscribe();
    }
    this._timerSubscription = interval(tickRate).subscribe(x => this.tick.next(tickRate));
  }
}
