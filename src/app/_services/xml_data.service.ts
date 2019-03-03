import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private storyTitle = new BehaviorSubject('default Title');
  currentTitle = this.storyTitle.asObservable();

  constructor() { }

  changeTitle(title: string) {
    this.storyTitle.next(title)
  }

}
