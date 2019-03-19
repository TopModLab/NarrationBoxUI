import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {IPanel} from "@app/panel";

@Injectable()
export class DataService {

  private storyTitle = new BehaviorSubject('default Title');
  private introduction = new BehaviorSubject('default value');
  private number_of_scenes = new BehaviorSubject(0);
  //panelElements: IPanel[] = new BehaviorSubject();

  currentTitle = this.storyTitle.asObservable();
  currentIntroduction = this.introduction.asObservable();
  current_number_of_scenes = this.number_of_scenes.asObservable();
  //currentPanelElements = this.panelElements;

  constructor() { }

  // changePanelElements(panel : IPanel[]){
  //   this.panelElements.next(panel);
  // }

  changeTitle(title: string) {
    this.storyTitle.next(title)
  }

  changeIntroduction(introduction: string){
    this.introduction.next(introduction);
  }

  changeNumberOfScenes(num: number){
    this.number_of_scenes.next(num);
  }
}
