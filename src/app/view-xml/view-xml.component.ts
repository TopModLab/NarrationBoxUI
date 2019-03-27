import { Component, OnInit } from '@angular/core';
import {XMLData} from "@app/XMLData";
import {DataService} from "@app/_services/xml_data.service";
import {ConfigServiceService} from "@app/_services/config-service.service";

@Component({
  selector: 'app-view-xml',
  templateUrl: './view-xml.component.html',
  styleUrls: ['./view-xml.component.css']
})
export class ViewXmlComponent implements OnInit {

  xml_data = new XMLData("",0,"");
  storyTitle: string;
  introduction: string;
  number_of_scenes: number;
  xml_file: string;
  ret = new Array()



  constructor(private data: DataService, private request: ConfigServiceService) { }

  extractStoryInfo(response: any){
    console.log(response);
  }

  ngOnInit() {
    let url = "http://narration-box.herokuapp.com/stories/{id}?id=3";

    this.request.getStory(url).subscribe (data => {
      this.extractStoryInfo(data)
    });

    this.data.currentTitle.subscribe(title => this.storyTitle = title);
    this.data.currentIntroduction.subscribe(intro => this.introduction = intro);
    this.data.current_number_of_scenes.subscribe(num => this.number_of_scenes = num);




    let XMLWriter = require('xml-writer');
    let xw = new XMLWriter;
    xw.startDocument();
    xw.startElement('story');
    xw.writeAttribute('title', this.storyTitle);
    //xw = xw.toString() + '\n';

    xw.startElement('introduction');
    xw.writeAttribute('info', this.introduction);
    //xw = xw.toString() + '\n';

    xw.endElement('introduction');
    //xw = xw.toString() + '\n';

    for(let i = 0 ; i < this.number_of_scenes; i++){
      xw.startElement('scene');
      xw.writeAttribute('id', ""+ (i+1));
      xw.writeAttribute('background', " ");
      //xw = xw.toString() + '\n';

      xw.startElement('characters');
      //xw = xw.toString() + '\n';

      for(let j = 0; j < 2; j++){

      }
      xw.endElement('characters');
      //xw = xw.toString() + '\n';
      xw.endElement('scene');
      //xw = xw.toString() + '\n';
    }

    // xw.text('Some content');


    xw.endDocument();

    console.log(xw.toString());

    this.xml_file = xw.toString();


    // function chunk(str, n) {
    //   let ret = [];
    //   let i;
    //   let len;
    //
    //   for(i = 0, len = str.length; i < len; i += n) {
    //     ret.push(str.substr(i, n))
    //   }
    //
    //   return ret
    // };
    //
    // chunk("The quick brown fox jumps over the lazy dogs.", 5).join('$');


    let start_index = 0;
    for(let i = 0; i < this.xml_file.length; i += 1) {
      if(this.xml_file[i] == '>'){
        this.ret.push(this.xml_file.substring(start_index,i+1));
        start_index = i+1;
      }
    }

    this.xml_file = this.ret.join('\n');
  }

}
