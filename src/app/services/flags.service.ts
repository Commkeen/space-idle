import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlagsService {
  public showOutpostPanel = false;

  public flags: Set<string> = new Set<string>();

  public onFlagsUpdated: Subject<void> = new Subject();

  constructor() {}

  init(): void {
    this.onFlagsUpdated.next();
    this.set('showStructureTab');
    this.set('shuttleFound');
  }

  check(flag: string): boolean {
    if (flag === '') {return false;}
    return this.flags.has(flag);
  }

  set(flag: string) {
    if (flag === '') {return;}
    this.flags.add(flag);
    this.onFlagsUpdated.next();
  }

  clear(flag: string) {
    this.flags.delete(flag);
    this.onFlagsUpdated.next();
  }
}
