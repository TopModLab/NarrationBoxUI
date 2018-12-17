import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

 appTitle = 'Narration Box';

 HomeBg: boolean = false;
 IntroBg: boolean = false;
 StoryBg: boolean = false;
 FinalBg: boolean = false;

 constructor() { }

  ngOnInit() {
  }

  HomeClick(){
   this.HomeBg = true;
   this.IntroBg = false;
   this.StoryBg = false;
   this.FinalBg = false;
  }
  IntoClick(){
    this.HomeBg = false;
    this.IntroBg = true;
    this.StoryBg = false;
    this.FinalBg = false;
  }
  StoryClick(){
    this.HomeBg = false;
    this.IntroBg = false;
    this.StoryBg = true;
    this.FinalBg = false;
  }
  FinalClick(){
    this.HomeBg = false;
    this.IntroBg = false;
    this.StoryBg = false;
    this.FinalBg = true;
  }
}
