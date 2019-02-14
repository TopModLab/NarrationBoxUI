import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-story-builder',
  templateUrl: './story-builder.component.html',
  styleUrls: ['./story-builder.component.css']
})

export class StoryBuilderComponent implements OnInit {

  number_of_scenes: number = 1;
  scene_number: number = 1;
  prevButtonFlag: boolean = false;
  scenes: Scene[] = new Array();

  constructor() { }

  prevClicked(){

    if(this.scene_number > 1){
      this.scene_number -= 1;
      }
    if(this.scene_number == 1){
      this.prevButtonFlag = false;
    }
    console.log(this.number_of_scenes);
  }

  nextClicked(){
    this.number_of_scenes += 1;
    this.scene_number += 1;
    this.prevButtonFlag = true;
    console.log(this.number_of_scenes);
  }
  ngOnInit() {
  }

}
export class Scene{
  messages: string[] = new Array();
  img1: any;
  img2: any;
}
