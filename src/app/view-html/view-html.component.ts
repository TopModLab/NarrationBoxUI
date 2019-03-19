import { Component, OnInit } from '@angular/core';
import {DataService} from "@app/_services/xml_data.service";

@Component({
  selector: 'app-view-html',
  templateUrl: './view-html.component.html',
  styleUrls: ['./view-html.component.css']
})
export class ViewHtmlComponent implements OnInit {

  storyTitle: string;
  introduction: string;

  constructor(private data:DataService) { }

  ngOnInit() {
    this.data.currentTitle.subscribe(title => this.storyTitle = title);
    this.data.currentIntroduction.subscribe(intro => this.introduction = intro);
  }

}
