import { Component, OnInit } from '@angular/core';
import {XMLData} from "@app/XMLData";
import {DataService} from "@app/_services/xml_data.service";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ConfigServiceService} from "@app/_services/config-service.service";
import {CreateStoryRequestBody} from "@app/create-story-request-body";
import {v4 as uuid } from 'uuid';
import {IState} from "@app/state";
import {AppData} from "@app/AppData";
import {IPanel} from "@app/panel";
import {StoryViewModel} from "@app/story-view-model";

//import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {

  //xml_data = new XMLData("",0,"");
  //public SceneMap = new Map();

  public story = new StoryViewModel();
  public story_id: string = uuid();



  // Mode variables
  //  loading: boolean = false;
  introductionMode: boolean = true;
  buildMode: boolean = false;
  selectionMode: boolean = false;
  viewXMLMode: boolean = false;
  viewHTMLMode: boolean = false;

  //XML variables.
  xml_file: string;
  ret = new Array();

  // Story Building variables
  userEnteredText: string[] = new Array();
  markovGeneratedTexts: string[] = new Array();
  number_of_scenes: number = 0;
  arg1: object;
  arg2: object;
  data = new AppData('','','','',this.arg1,this.arg2);
  scene_number: number = 1;
  prevButtonFlag: boolean = false;
  panelElements: IPanel[] = new Array();
  isImageLoading: boolean;
  imageRequests: object[] = new Array();
  images:any = [];


  // let uuidv4 = require('uuid/v4');
  // public story_id = this.uuidv4.uuidv4();

  public storyTitle: string;
  //public introduction = "This story has characters, Tom the shark, Jerry the Octopus and Quirky the sealion. The relationship between them is defined as " +
  //  "per the markov chain.";

  public checkBoxes: boolean[] = [false, false, false, false, false, false, false];

  //public charactersInStory: string[] = new Array();
  public title: string;
  public user_story_ids: string[] = new Array();

  // public create_story_request: CreateStoryRequestBody();

  public defaults: string[] = ["assets/img/shark_default.png", "assets/img/octopus_default.png",
    "assets/img/sealion_default.png", "assets/img/seaturtle_default.png", "assets/img/starfish_default.png","assets/img/oyester_default.png", "assets/img/fish_default.png"];

  constructor(private xml_data: DataService, private requestService: ConfigServiceService) { }

  prevClicked(){

    this.scene_number -= 1;

    if(this.scene_number == 1){
      this.prevButtonFlag = false;
    }

    let k = 2*(this.scene_number-1);
    this.data.user_entered_dialogue1 = this.userEnteredText[k];
    this.data.user_entered_dialogue2 = this.userEnteredText[k+1];

    this.data.markov_dialog_1 = this.markovGeneratedTexts[k];
    this.data.markov_dialog_2 = this.markovGeneratedTexts[k+1];

    this.data.imageRequest1 = this.imageRequests[k];
    this.data.imageRequest2 = this.imageRequests[k+1];
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

  async getDefaultImage(panel: IPanel){
    let imageRequest = {
      resolved: false,
      error: false,
      blob: null
    };

    let url = "https://narration-box.herokuapp.com/images/" + panel.character_name + "?emotion=default";
    console.log(url);
    await this.requestService.getConfig(url).subscribe(data => {

        console.log("----------------------->>>", data.size, panel.character_name, panel.emotional);
        if (data.size > 0) {
          this.createImageFromBlob(data, imageRequest);
          this.isImageLoading = false;
          imageRequest.resolved = true;
        }
      },
      error => {
        this.isImageLoading = false;
        imageRequest.resolved = true;
        imageRequest.error = true;
        console.log(error);
      });

    console.log("Getting image done", imageRequest, url);

    return imageRequest;
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

      console.log("----------------------->>>",data.size, panel.character_name, panel.emotional);
      if(data.size > 0) {

        this.createImageFromBlob(data, imageRequest);
        this.isImageLoading = false;
        imageRequest.resolved = true;
      }
      else{

        return this.getDefaultImage(panel);

        // imageRequest.blob = "@assets/img/"+panel.character_name+"_default.png";
        // url = "https://narration-box.herokuapp.com/images/" + panel.character_name + "?emotion=default";
        // await this.requestService.getConfig(url).subscribe(data => {
        //   console.log("Loading default");
        //   this.createImageFromBlob(data, imageRequest);
        //   this.isImageLoading = false;
        //   imageRequest.resolved = true;
        // },error => {
        //     this.isImageLoading = false;
        //     imageRequest.resolved = true;
        //     imageRequest.error = true;
        //     console.log(error);
        //   }
        //   );
      }
    }, error => {
      this.isImageLoading = false;
      imageRequest.resolved = true;
      imageRequest.error = true;
      console.log(error);
    });

    console.log("Getting image done", imageRequest, url);
    return imageRequest;
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

    if(count == 1){
      const panel = {} as IPanel;
      panel.character_id = " ";
      panel.emotional = " ";
      panel.causality = " ";
      panel.character_name = " ";
      console.log(panel);
      this.panelElements.push(panel);

      // this.xml_data.changePanelElements(this.panelElements);

      let imageRequest = {} as IPanel;

      //imageRequest = this.getImage(panel);
      this.imageRequests.push(imageRequest);
      console.log("Image Request: ");
      this.markovGeneratedTexts.push(" ");
      this.userEnteredText.push(" ");
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

      console.log("--- panel elements: === ", this.panelElements);
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

      this.requestService.post("http://narration-box.herokuapp.com/stories/newPanel?storyId="+this.story_id).subscribe (data => {
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
  }

  completeStory(){
    this.selectionMode = true;
    this.buildMode = false;
    this.viewXMLMode = false;
    this.viewHTMLMode = false;

    if(this.scene_number == this.number_of_scenes) {

      this.userEnteredText.push(this.data.user_entered_dialogue1);
      this.userEnteredText.push(this.data.user_entered_dialogue2);
    }


    let url = "http://narration-box.herokuapp.com/stories/{id}?id=3";
    this.requestService.getStory(url).subscribe (data => {
      this.extractStoryInfo(data)
    });


  }

  viewHTMLClicked(){
    this.selectionMode = false;
    this.buildMode = false;
    this.viewXMLMode = false;
    this.viewHTMLMode = true;
    this.introductionMode = false;

  }

  viewXMLClicked(){
    this.introductionMode = false;
    this.selectionMode = false;
    this.buildMode = false;
    this.viewXMLMode = true;
    this.viewHTMLMode = false;
    //
    // let url = "http://narration-box.herokuapp.com/stories/{id}?id=3";
    //
    // this.requestService.getStory(url).subscribe (data => {
    //   this.extractStoryInfo(data)
    // });

    // make XML
    let XMLWriter = require('xml-writer');
    let xw = new XMLWriter;
    xw.startDocument();
    xw.startElement('story');
    xw.writeAttribute('title', this.storyTitle);
    //xw = xw.toString() + '\n';

    xw.startElement('introduction');
    xw.writeAttribute('info', ""); // fill introduction
    //xw = xw.toString() + '\n';

    xw.endElement('introduction');
    xw = xw.toString() + '\n';

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

  }

  extractStoryInfo(response: any){
    console.log(response.title);
    this.storyTitle = response.title;

  }

  returnClicked(){
    this.introductionMode = false;
    this.selectionMode = false;
    this.buildMode = true;
    this.viewXMLMode = false;
    this.viewHTMLMode = false;
  }

  generateStory(){

    this.introductionMode = false;
    this.selectionMode = false;
    this.buildMode = true;
    this.viewXMLMode = false;
    this.viewHTMLMode = false;

    //this.loading = true;

    let charactersInStory: string[] = new Array();
    for(let i=0; i<this.checkBoxes.length;i++) {
      let c: string;

      if (this.checkBoxes[i] == true) {
        c = (i + 1).toString();
        charactersInStory.push(c);
      }
    }

    console.log(this.storyTitle);
    console.log(this.story_id);
    console.log(charactersInStory);
    let create_story_request: CreateStoryRequestBody = new CreateStoryRequestBody(this.storyTitle, this.story_id.toString(), charactersInStory);
      // create_story_request.title = this.storyTitle;
      // create_story_request.id = this.story_id.toString();
    this.story.id = this.story_id;
    this.story.title = this.storyTitle;


    this.user_story_ids.push(this.story_id);
    this.story_id = uuid();
      // create_story_request.charactersInStory = this.charactersInStory;


      this.requestService.addStory("http://narration-box.herokuapp.com/stories/", create_story_request).subscribe (data => {
        this.createFirstScene(data);
      });

    this.number_of_scenes += 1;

  }


  createFirstScene(state: IState){
    console.log(state);
    this.story.id = state.id;
    this.story.title = state.title;
    this.createFirstSceneHelper(state).then(() => {
      //this.loading = false;
      //this.buildMode = true;
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

  async createFirstSceneHelper(state: IState) {
    let count = 0;
    for(let character of state.panels[0].characters){
      console.log("Character");
      if(count < 2) {
        count += 1;
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
    if(count == 1){
      const panel = {} as IPanel;
      panel.character_id = " ";
      panel.emotional = " ";
      panel.causality = " ";
      panel.character_name = " ";
      console.log(panel);
      this.panelElements.push(panel);

      // this.xml_data.changePanelElements(this.panelElements);

      let imageRequest = {} as IPanel;

      //imageRequest = this.getImage(panel);
      this.imageRequests.push(imageRequest);
      console.log("Image Request: ");
      this.markovGeneratedTexts.push(" ");
      this.userEnteredText.push(" ");
    }

  }

  getCharacterName(id: string){

    return new Promise((resolve, reject) => {
      this.requestService.getName("http://narration-box.herokuapp.com/characters/"+id).subscribe(data => {
        resolve(data);
      });
    });

  }



  ngOnInit() {

    //this.data.currentTitle.subscribe(message => this.storyTitle = message)

    //   this.InitiateData();
    //
    //   this.xml_data.story_title = this.storyTitle;
    //   //this.xml_data.introduction = this.introduction;
    // }
    //
    // InitiateData(){
    //   this.xml_data.changeTitle(this.storyTitle);
    //   //this.data.changeIntroduction(this.introduction);
    // }
  }
}
