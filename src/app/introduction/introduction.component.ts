import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {

  public storyTitle = "Title";
  // public introduction = "Once upon a time, there was a group of animals in some zoo. The whale and sea horse were good friends......";

  constructor() { }

  ngOnInit() {
  }

}
