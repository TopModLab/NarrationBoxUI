import { Component, OnInit } from '@angular/core';
import {ConfigServiceService} from "@app/_services/config-service.service";
import {IState} from "@app/state";
import {IPanel} from "@app/panel";

import {AppData} from "@app/AppData";
import {INextPanel} from "@app/addNextPanel";
import {DataService} from "@app/_services/xml_data.service";

@Component({
  selector: 'app-story-builder',
  templateUrl: './story-builder.component.html',
  styleUrls: ['./story-builder.component.css']
})

export class StoryBuilderComponent implements OnInit {

  userEnteredText: string[] = new Array();
  markovGeneratedTexts: string[] = new Array();
  number_of_scenes: number = 0;
  arg1: object;
  arg2: object;
  data = new AppData('','','','',this.arg1,this.arg2);

  scene_number: number = 1;
  prevButtonFlag: boolean = false;
  //scenes: Scene[] = new Array();
  character: object;
  number_of_characters: number = 3;
  panelElements: IPanel[] = new Array();

  isImageLoading: boolean;
  imageRequests: object[] = new Array();
  images:any = [];
  queryStrings: string[] = new Array();


  textarea1: string;
  textarea2: string;

  constructor(private requestService: ConfigServiceService, private xml_data: DataService) { }

  prevClicked(){

    this.scene_number -= 1;

    if(this.scene_number == 1){
      this.prevButtonFlag = false;
    }

    // if(this.scene_number != 1){
    //   this.scene_number -= 1;
    //   }

    //console.log(this.userEnteredText[2*(this.scene_number-1)]);
    let k = 2*(this.scene_number-1);
    this.data.user_entered_dialogue1 = this.userEnteredText[k];
    this.data.user_entered_dialogue2 = this.userEnteredText[k+1];

    this.data.markov_dialog_1 = this.markovGeneratedTexts[k];
    this.data.markov_dialog_2 = this.markovGeneratedTexts[k+1];

    this.data.imageRequest1 = this.imageRequests[k];
    this.data.imageRequest2 = this.imageRequests[k+1];
    //console.log(this.number_of_scenes);
  }

  createImageFromBlob(image: Blob, imageRequest: any) {
    console.log("Create Image from Blob");
    let reader = new FileReader();
    //console.log(image);
    reader.addEventListener("load", () => {
      this.images.push((reader.result).toString());
      imageRequest.blob = (reader.result).toString();
    }, false);

    console.log("Create Image from Blob done");

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  async createFirstSceneHelper(state: IState) {
      for(let character of state.panels[0].characters){
        console.log("Character");

        await this.getCharacterName(character["character-name"]).then(data => {
          const panel = {} as IPanel;
          panel.character_id = character["character-name"];
          panel.emotional = character["emotional"];
          panel.causality = "";
          panel.character_name = data['identity']['id'];
          console.log(panel);
          this.panelElements.push(panel);

          // this.xml_data.changePanelElements(this.panelElements);

          let imageRequest: object;
          imageRequest = this.getImage(panel);
          this.imageRequests.push(imageRequest);
          console.log("Image Request: ");
        });
      }
    }

  createFirstScene(state: IState){
    console.log("imageRequest[0]: " + this.imageRequests[0]);
    console.log("imageRequest[1]: " + this.imageRequests[1]);

    this.createFirstSceneHelper(state).then(() => {
      this.data.imageRequest1 = this.imageRequests[0];
      console.log("Image Request Inside ", this.imageRequests[0]);
      console.log("Image Request Inside ", this.imageRequests[1]);
      this.data.imageRequest2 = this.imageRequests[1];
      this.data.markov_dialog_1 = this.panelElements[0].character_name+" is "+this.panelElements[0].emotional+".He said, ";
      this.data.markov_dialog_2 = this.panelElements[1].character_name+" is "+this.panelElements[1].emotional+" and he said, ";
      this.markovGeneratedTexts.push(this.data.markov_dialog_1);
      this.markovGeneratedTexts.push(this.data.markov_dialog_2);

      console.log("Character 1 name: "+this.getCharacterName(this.panelElements[0].character_name));
      console.log("Character 2 name: "+this.getCharacterName(this.panelElements[1].character_name));
      console.log(this.markovGeneratedTexts);
    });

  }

  getImage(panel: IPanel){
    console.log("Getting Image");
    this.isImageLoading = true;
    let imageRequest = {
      resolved: false,
      error: false,
      blob: null
    };

    let url = "https://narration-box.herokuapp.com/images/" + panel.character_name + "?emotion=" + panel.emotional;
    console.log(url);
    this.requestService.getConfig(url).subscribe(data => {
      this.createImageFromBlob(data, imageRequest);
      this.isImageLoading = false;
      imageRequest.resolved = true;
    }, error => {
      this.isImageLoading = false;
      imageRequest.resolved = true;
      imageRequest.error = true;
      console.log(error);
    });
    console.log("Getting image done", imageRequest);
    return imageRequest;
  }

  getCharacterName(id: string){

    return new Promise((resolve, reject) => {
      this.requestService.getName("http://narration-box.herokuapp.com/characters/"+id).subscribe(data => {
        resolve(data);
      });
    });

  }

  async createSceneHelper(response: any) {
    let count = 0;
    for(let character of response.characters){
      if(count < 2) {
        count += 1;
        const panel = {} as IPanel;
        await this.getCharacterName(character.emotional_causality).then(data => {
          panel.causing_char = data['identity']['id'];
        }).then(async() => {
          await this.getCharacterName(character["character-name"]).then(data => {
            panel.character_id = character["character-name"];
            panel.emotional = character["emotional"];
            panel.causality = character.emotional_causality;
            panel.character_name = data['identity']['id'];
            this.panelElements.push(panel);
            let imageRequest: object;
            imageRequest = this.getImage(panel);
            this.imageRequests.push(imageRequest);
          })
        });
      }
    }
  }


  createScene(response: any){
    //const obj = {5.0: 10, 28.0: 14, 3.0: 6};

    // const chars = Object.keys(characters).map(key => ({type: key, value: characters[key]}));
    console.log(response);
    console.log("Response received");
    // console.log(chars[0]);
    this.createSceneHelper(response).then(() => {
      let k = 2*(this.scene_number - 1);

      this.userEnteredText.push(this.data.user_entered_dialogue1);
      this.userEnteredText.push(this.data.user_entered_dialogue2);

      // setTimeout(function () {
      //
      // }, 2000);

      this.data.user_entered_dialogue1 = "";
      this.data.user_entered_dialogue2 = "";

      this.data.imageRequest1 = this.imageRequests[k];
      this.data.imageRequest2 = this.imageRequests[k+1];
      this.data.markov_dialog_1 = this.panelElements[k].character_name+" is "+this.panelElements[k].emotional +" because of "+ this.panelElements[k].causing_char+". He said, ";
      this.data.markov_dialog_2 = this.panelElements[k+1].character_name+" is "+this.panelElements[k+1].emotional +" because of "+ this.panelElements[k+1].causing_char+". He said, ";

      this.markovGeneratedTexts.push(this.data.markov_dialog_1);
      this.markovGeneratedTexts.push(this.data.markov_dialog_2);

      console.log();
    });
  }

  nextClicked(){

    this.scene_number += 1;
    this.prevButtonFlag = true;
    // TODO: Important
    if(this.scene_number == this.number_of_scenes + 1){
      this.number_of_scenes += 1;

      this.xml_data.changeNumberOfScenes(this.number_of_scenes);

      this.requestService.post("http://narration-box.herokuapp.com/stories/newPanel?storyId=3").subscribe (data => {
        this.createScene(data)
      });
    }
    else {
      console.log(this.data.user_entered_dialogue1);

      let k = 2*(this.scene_number-1);

      this.data.user_entered_dialogue1 = this.userEnteredText[k];
      this.data.user_entered_dialogue2 = this.userEnteredText[k+1];

      this.data.markov_dialog_1 = this.markovGeneratedTexts[k];
      this.data.markov_dialog_2 = this.markovGeneratedTexts[k+1];

      this.data.imageRequest1 = this.imageRequests[k];
      this.data.imageRequest2 = this.imageRequests[k+1];
      //this.userEnteredText.push(this.data.user_entered_dialogue1);
      //this.userEnteredText.push(this.data.user_entered_dialogue2);

      console.log(this.data.user_entered_dialogue2);
      console.log(this.userEnteredText);
    }
    // let k = 2*(this.scene_number - 2);
    //
    // this.data.imageRequest1 = this.imageRequests[k];
    // this.data.imageRequest2 = this.imageRequests[k+1];
    //
    //
    //
    // this.userEnteredText[k] = this.data.user_entered_dialogue1;
    // this.userEnteredText[k+1] = this.data.user_entered_dialogue2;
    //document.getElementById("textArea1").innerHTML = "";
  }

  completeStory(){

  }

  ngOnInit() {
    console.log("Start");
    let url = "http://narration-box.herokuapp.com/stories/{id}?id=3";
    // let url = "http://narration-box.herokuapp.com/stories/";
    url = encodeURI(url);
    this.requestService.getState(url).subscribe (data => {
      this.createFirstScene(data)
    });
    console.log(":: Called create First Scene");
    this.number_of_scenes += 1;

  }
}
// export class Scene{
//   messages: string[] = new Array();
//   img1: any;
//   img2: any;
// }
