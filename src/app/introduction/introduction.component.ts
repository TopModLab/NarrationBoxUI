import { Component, OnInit } from '@angular/core';
import {XMLData} from "@app/XMLData";
import {DataService} from "@app/_services/xml_data.service";

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {

  xml_data = new XMLData("",0,"");

  public storyTitle = "Animal Kingdom";
  public introduction = "This story has characters, Tom the shark, Jerry the Octopus and Quirky the sealion. The relationship between them is defined as " +
    "per the markov chain.";

  constructor(private data: DataService) { }

  ngOnInit() {

    //this.data.currentTitle.subscribe(message => this.storyTitle = message)

    this.InitiateData();

    this.xml_data.story_title = this.storyTitle;
    this.xml_data.introduction = this.introduction;
  }

  InitiateData(){
    this.data.changeTitle(this.storyTitle);
    this.data.changeIntroduction(this.introduction);
  }

}
