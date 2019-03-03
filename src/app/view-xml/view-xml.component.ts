import { Component, OnInit } from '@angular/core';
import {XMLData} from "@app/XMLData";
import {DataService} from "@app/_services/xml_data.service";

@Component({
  selector: 'app-view-xml',
  templateUrl: './view-xml.component.html',
  styleUrls: ['./view-xml.component.css']
})
export class ViewXmlComponent implements OnInit {

  xml_data = new XMLData("",0,"");
  storyTitle: string;

  constructor(private data: DataService) { }

  ngOnInit() {

    this.data.currentTitle.subscribe(title => this.storyTitle = title);

    let XMLWriter = require('xml-writer');
    let xw = new XMLWriter;
    xw.startDocument();
    xw.startElement('story');
    xw.writeAttribute('title', this.storyTitle);
    // xw.text('Some content');
    xw.endDocument();

    console.log(xw.toString());


  }

}
