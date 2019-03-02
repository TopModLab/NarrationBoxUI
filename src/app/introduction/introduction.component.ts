import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {

  public storyTitle = "Animal Kingdom";
  public introduction = "This story has characters, Tom the shark, Jerry the Octopus and Quirky the sealion. The relationship between them is defined as " +
    "per the markov chain.";

  constructor() { }

  ngOnInit() {
  }

}
