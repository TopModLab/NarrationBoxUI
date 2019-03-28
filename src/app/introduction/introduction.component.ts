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
import {CharacterModel} from "@app/character-model";
import {SceneModel} from "@app/scene-model";

//import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {

  //xml_data = new XMLData("",0,"");
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

  public CharacterIdToNameMap = new Map();


  constructor(private xml_data: DataService, private requestService: ConfigServiceService) { }


  // use ngOnInit and populateMap to generate statements for the actors in the display screen.
  ngOnInit() {
    let url ="http://narration-box.herokuapp.com/characters/";
    this.requestService.getCharactersInfo(url).subscribe(data => {
          this.populateMap(data);
      }

    );

  }

  populateMap(response: any){
   console.log(response);
    for(let item in response){
     this.CharacterIdToNameMap.set(response[item].id, response[item].identity.id);
   }

    console.log(this.CharacterIdToNameMap);
  }

  prevClicked(){

    this.scene_number -= 1;
    if(this.scene_number == 1){
      this.prevButtonFlag = false;
    }

    if(this.scene_number+1 == this.number_of_scenes){
      let scene = new SceneModel();
      scene = this.story.panel[this.scene_number];

      scene.characters[0].user_text = this.data.user_entered_dialogue1;
      if(scene.characters.length == 2){
        scene.characters[1].user_text = this.data.user_entered_dialogue2;
      }
    }

    let scene = new SceneModel();
    console.log("SCENE NUMBER: ", this.scene_number);
    scene = this.story.panel[this.scene_number-1];
    //let k = this.scene_number-1;
    console.log(scene);
    if(scene.characters.length == 2) {
      this.data.user_entered_dialogue1 = scene.characters[0].user_text;
      this.data.user_entered_dialogue2 = scene.characters[1].user_text;

      this.data.markov_dialog_1 = scene.characters[0].markov_generated;
      this.data.markov_dialog_2 = scene.characters[1].markov_generated;

      this.data.imageRequest1 = scene.characters[0].image;
      this.data.imageRequest2 = scene.characters[1].image;
    }
    else if(scene.characters.length == 1){
      this.data.user_entered_dialogue1 = scene.characters[0].user_text;
      this.data.user_entered_dialogue2 = null;

      this.data.markov_dialog_1 = scene.characters[0].markov_generated;
      this.data.markov_dialog_2 = null;

      this.data.imageRequest1 = scene.characters[0].image;
      this.data.imageRequest2 = null;
    }
    // let k = 2*(this.scene_number-1);
    // this.data.user_entered_dialogue1 = this.userEnteredText[k];
    // this.data.user_entered_dialogue2 = this.userEnteredText[k+1];
    //
    // this.data.markov_dialog_1 = this.markovGeneratedTexts[k];
    // this.data.markov_dialog_2 = this.markovGeneratedTexts[k+1];
    //
    // this.data.imageRequest1 = this.imageRequests[k];
    // this.data.imageRequest2 = this.imageRequests[k+1];
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

  async getDefaultImage(character: CharacterModel){
    let imageRequest = {
      resolved: false,
      error: false,
      blob: null
    };

    let url = "https://narration-box.herokuapp.com/images/" + character.character_name + "?emotion=default";
    console.log(url);
    await this.requestService.getConfig(url).subscribe(data => {

        //console.log("----------------------->>>", data.size, panel.character_name, panel.emotional);
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

  // getImage(panel: IPanel){
  //   console.log("Getting Image");
  //   // this.isImageLoading = true;
  //   // let imageRequest = {
  //   //   resolved: false,
  //   //   error: false,
  //   //   blob: null
  //   // };
  //   //
  //   // let url = "https://narration-box.herokuapp.com/images/" + panel.character_name + "?emotion=" + panel.emotional;
  //   // console.log(url);
  //   // this.requestService.getConfig(url).subscribe(data => {
  //   //
  //   //   console.log("----------------------->>>",data.size, panel.character_name, panel.emotional);
  //   //   if(data.size > 0) {
  //   //
  //   //     this.createImageFromBlob(data, imageRequest);
  //   //     this.isImageLoading = false;
  //   //     imageRequest.resolved = true;
  //   //   }
  //   //   else{
  //   //
  //   //     return this.getDefaultImage(panel);
  //   //
  //   //     // imageRequest.blob = "@assets/img/"+panel.character_name+"_default.png";
  //   //     // url = "https://narration-box.herokuapp.com/images/" + panel.character_name + "?emotion=default";
  //   //     // await this.requestService.getConfig(url).subscribe(data => {
  //   //     //   console.log("Loading default");
  //   //     //   this.createImageFromBlob(data, imageRequest);
  //   //     //   this.isImageLoading = false;
  //   //     //   imageRequest.resolved = true;
  //   //     // },error => {
  //   //     //     this.isImageLoading = false;
  //   //     //     imageRequest.resolved = true;
  //   //     //     imageRequest.error = true;
  //   //     //     console.log(error);
  //   //     //   }
  //   //     //   );
  //   //   }
  //   // }, error => {
  //   //   this.isImageLoading = false;
  //   //   imageRequest.resolved = true;
  //   //   imageRequest.error = true;
  //   //   console.log(error);
  //   // });
  //   //
  //   // console.log("Getting image done", imageRequest, url);
  //   // return imageRequest;
  // }

  async getImage(character: CharacterModel){
    this.isImageLoading = true;
    let imageRequest = {
      resolved: false,
      error: false,
      blob: null
    };

    let url = "https://narration-box.herokuapp.com/images/" + character.character_name + "?emotion=" + character.emotional;
    console.log(url);
    await this.requestService.getConfig(url).subscribe(data => {
      if (data.size > 0) {

        this.createImageFromBlob(data, imageRequest);
        this.isImageLoading = false;
        imageRequest.resolved = true;
      } else {
        return this.getDefaultImage(character);
      }
    }, error => {
      this.isImageLoading = false;
      imageRequest.resolved = true;
      imageRequest.error = true;
      console.log(error);
    });

    return imageRequest;
  }

  async createSceneHelper(response: any) {
    let count = 0;
    let scene = new SceneModel();
    for (let character of response.characters) {
      if (count < 2) {
        count += 1;
        //const panel = {} as IPanel;
        //let char = new CharacterModel();
        //char = character;
        character.emotional_causality = this.CharacterIdToNameMap.get(character.emotional_causality);
        character.character_id = character['character-name'];
        character.character_name = this.CharacterIdToNameMap.get(character['character-name']);
        character.markov_generated = character.character_name + " is " + character.emotional + " because of " + character.emotional_causality + ". He said";
        character.user_text = "";


        await this.getImage(character).then(data =>
          {
            character.image = data;
            console.log("CHARACTER IMAge ===  ",character.image);

            console.log(scene);
            scene.characters.push(character);
            console.log("Character pushed to scene");


          }

        );

        //imageRequest = this.getImage(panel);
        //this.imageRequests.push(imageRequest);

      }
    }
    this.story.panel.push(scene);

    return scene;
    // if(count == 1){
    //
    // }
      // if (count == 1) {
      //   const panel = {} as IPanel;
      //   panel.character_id = " ";
      //   panel.emotional = " ";
      //   panel.causality = " ";
      //   panel.character_name = " ";
      //   console.log(panel);
      //   this.panelElements.push(panel);
      //
      //   // this.xml_data.changePanelElements(this.panelElements);
      //
      //   let imageRequest = {} as IPanel;
      //
      //   //imageRequest = this.getImage(panel);
      //   this.imageRequests.push(imageRequest);
      //   console.log("Image Request: ");
      //   this.markovGeneratedTexts.push(" ");
      //   this.userEnteredText.push(" ");
      // }



  }

  async createScene(state: any){
    //const obj = {5.0: 10, 28.0: 14, 3.0: 6};

    // const chars = Object.keys(characters).map(key => ({type: key, value: characters[key]}));
    // console.log(response);
    // console.log("Response received");
    // console.log(chars[0]);
    //let scene = new SceneModel();
    let scene = await this.createSceneHelper(state);

    console.log("Inside create scene after helper");
    console.log(scene);
    console.log(scene.characters.length);
      //let k = 2*(this.scene_number - 1);
      if(scene.characters.length == 2){
        this.data.markov_dialog_1 = scene.characters[0].markov_generated;
        this.data.markov_dialog_2 = scene.characters[1].markov_generated;

        scene.characters[0].user_text = this.data.user_entered_dialogue1;
        scene.characters[1].user_text = this.data.user_entered_dialogue2;

        this.data.user_entered_dialogue1 = "";
        this.data.user_entered_dialogue2 = "";

        this.data.imageRequest2 = scene.characters[1].image;
        this.data.imageRequest1 = scene.characters[0].image;
      }
      else if(scene.characters.length == 1)
      {
        this.data.markov_dialog_1 = scene.characters[0].markov_generated;

        this.data.markov_dialog_2 = "";

        scene.characters[0].user_text = this.data.user_entered_dialogue1;
        //scene.characters[1].user_text = this.data.user_entered_dialogue2;

        this.data.user_entered_dialogue1 = "";
        this.data.user_entered_dialogue2 = null;

        this.data.imageRequest2 = null;
        this.data.imageRequest1 = scene.characters[0].image;
      }

      // for(let character in scene.characters){
      //   this.data.user_entered_dialogue2 = "";
      //   this.data.user_entered_dialogue2 = "";
      //   this.data.markov_dialog_1
      // }
      // this.userEnteredText.push(this.data.user_entered_dialogue1);
      // this.userEnteredText.push(this.data.user_entered_dialogue2);
      //
      // console.log("--- panel elements: === ", this.panelElements);
      // setTimeout(function () {
      //
      // }, 2000);

      // this.data.imageRequest1 = this.imageRequests[k];
      // this.data.imageRequest2 = this.imageRequests[k+1];
      // this.data.markov_dialog_1 = this.panelElements[k].character_name+" is "+this.panelElements[k].emotional +" because of "+ this.panelElements[k].causing_char+". He said, ";
      // this.data.markov_dialog_2 = this.panelElements[k+1].character_name+" is "+this.panelElements[k+1].emotional +" because of "+ this.panelElements[k+1].causing_char+". He said, ";
      //
      // this.markovGeneratedTexts.push(this.data.markov_dialog_1);
      // this.markovGeneratedTexts.push(this.data.markov_dialog_2);



  }

  nextClicked(){

    this.scene_number += 1;
    this.prevButtonFlag = true;

    console.log(this.scene_number, this.number_of_scenes);
    // TODO: Important
    if(this.scene_number == this.number_of_scenes + 1){
      this.number_of_scenes += 1;

      let scene = new SceneModel();
      scene = this.story.panel[this.scene_number-2];

      scene.characters[0].user_text = this.data.user_entered_dialogue1;
      if(scene.characters.length == 2){
        scene.characters[1].user_text = this.data.user_entered_dialogue2;
      }



      this.xml_data.changeNumberOfScenes(this.number_of_scenes);

      this.requestService.post("http://narration-box.herokuapp.com/stories/newPanel?storyId="+this.story.id).subscribe (data => {
        this.createScene(data)
      });
    }
    else {

      let storedScene = new SceneModel();
      storedScene = this.story.panel[this.scene_number-2];

      storedScene.characters[0].user_text = this.data.user_entered_dialogue1;
      if(storedScene.characters.length == 2){
        storedScene.characters[1].user_text = this.data.user_entered_dialogue2;
      }

      let scene = new SceneModel();
      scene = this.story.panel[this.scene_number-1];
      //let k = this.scene_number-1;
      if(scene.characters.length == 2) {
        this.data.user_entered_dialogue1 = scene.characters[0].user_text;
        this.data.user_entered_dialogue2 = scene.characters[1].user_text;

        this.data.markov_dialog_1 = scene.characters[0].markov_generated;
        this.data.markov_dialog_2 = scene.characters[1].markov_generated;

        this.data.imageRequest1 = scene.characters[0].image;
        this.data.imageRequest2 = scene.characters[1].image;
      }
      else if(scene.characters.length == 1){
        this.data.user_entered_dialogue1 = scene.characters[0].user_text;
        this.data.user_entered_dialogue2 = null;

        this.data.markov_dialog_1 = scene.characters[0].markov_generated;
        this.data.markov_dialog_2 = null;

        this.data.imageRequest1 = scene.characters[0].image;
        this.data.imageRequest2 = null;
      }
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

      let scene = new SceneModel();
      scene = this.story.panel[this.scene_number-1];
      //let k = this.scene_number-1;
      if(scene.characters.length == 2) {
        scene.characters[0].user_text = this.data.user_entered_dialogue1;
        scene.characters[1].user_text = this.data.user_entered_dialogue2;
        //this.data.user_entered_dialogue2 = scene.characters[1].user_text;
      }
      else if(scene.characters.length == 1){
        scene.characters[0].user_text = this.data.user_entered_dialogue1;
      }


      // this.userEnteredText.push(this.data.user_entered_dialogue1);
      // this.userEnteredText.push(this.data.user_entered_dialogue2);
    }


    let url = "http://narration-box.herokuapp.com/stories/{id}?id="+this.story.id;
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

    console.log(this.story);
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
    let create_story_request: CreateStoryRequestBody = new CreateStoryRequestBody(charactersInStory, this.story_id, this.storyTitle);
      // create_story_request.title = this.storyTitle;
      // create_story_request.id = this.story_id.toString();
    this.story.id = this.story_id;
    this.story.title = this.storyTitle;


    this.user_story_ids.push(this.story_id);
    this.story_id = uuid();
      // create_story_request.charactersInStory = this.charactersInStory;

    console.log(create_story_request);
      this.requestService.addStory("http://narration-box.herokuapp.com/stories/", create_story_request).subscribe (data => {
        this.createFirstScene(data);
      });

    this.number_of_scenes += 1;

  }


  async createFirstScene(state: IState){
    console.log(state);
    this.story.id = state.id;
    //this.story.title = state.title;
    this.story.panel = state.panels;

    console.log(this.story);

    let count = 0;
    for(let character of this.story.panel[0].characters){
      console.log("Character");
      if(count < 2) {
        count += 1;

          //const panel = {} as IPanel;
          character.character_id = character["character-name"];
          character.emotional = character["emotional"];
          character.emotional_causality = "";
          character.character_name = this.CharacterIdToNameMap.get(character["character-name"]);
          character.markov_generated = character.character_name + " is " + character.emotional + ". He said, ";

        // this.isImageLoading = true;
        // let imageRequest = {
        //   resolved: false,
        //   error: false,
        //   blob: null
        // };
        //
        // let url = "https://narration-box.herokuapp.com/images/" + character.character_name + "?emotion=" + character.emotional;
        // console.log(url);
        // this.requestService.getConfig(url).subscribe(data => {
        //   if(data.size > 0) {
        //
        //     this.createImageFromBlob(data, imageRequest);
        //     this.isImageLoading = false;
        //     imageRequest.resolved = true;
        //   }
        //   else{
        //     return this.getDefaultImage(character);
        //
        //   }
        // }, error => {
        //   this.isImageLoading = false;
        //   imageRequest.resolved = true;
        //   imageRequest.error = true;
        //   console.log(error);
        // });

          console.log("Before First scene get image");
          character.image = await this.getImage(character);
          console.log("After First scene get image");
          //console.log(panel);
          //this.panelElements.push(panel);

          // this.xml_data.changePanelElements(this.panelElements);

          //let imageRequest: object;
          //imageRequest = this.getImage(panel);
          //character.image = this.getImage(panel);
          //this.imageRequests.push(imageRequest);
          //console.log("Image Request: ");

      }
    }

    if(count == 1){
      let scene = this.story.panel[0];
      console.log("First Scene Created");
      this.data.user_entered_dialogue1 = "";
      //this.data.user_entered_dialogue2 = "";
      this.data.imageRequest1 = scene.characters[0].image;
      //this.data.imageRequest2 = scene.characters[1].image;
      this.data.markov_dialog_1 = scene.characters[0].markov_generated;
      //this.data.markov_dialog_2 = scene.characters[1].markov_generated;
    }
    else {
      let scene = this.story.panel[0];
      console.log("First Scene Created");
      this.data.user_entered_dialogue1 = "";
      this.data.user_entered_dialogue2 = "";
      this.data.imageRequest1 = scene.characters[0].image;
      this.data.imageRequest2 = scene.characters[1].image;
      this.data.markov_dialog_1 = scene.characters[0].markov_generated;
      this.data.markov_dialog_2 = scene.characters[1].markov_generated;
    }
    // if(count == 1){
    //   const panel = {} as IPanel;
    //   panel.character_id = " ";
    //   panel.emotional = " ";
    //   panel.causality = " ";
    //   panel.character_name = " ";
    //   console.log(panel);
    //   this.panelElements.push(panel);
    //
    //   // this.xml_data.changePanelElements(this.panelElements);
    //
    //   let imageRequest = {} as IPanel;
    //
    //   //imageRequest = this.getImage(panel);
    //   this.imageRequests.push(imageRequest);
    //   console.log("Image Request: ");
    //   this.markovGeneratedTexts.push(" ");
    //   this.userEnteredText.push(" ");
    // }

    // this.createFirstSceneHelper(state).then(() => {
    //   //this.loading = false;
    //   //this.buildMode = true;
    //   this.data.imageRequest1 = this.imageRequests[0];
    //   console.log("Image Request Inside ", this.imageRequests[0]);
    //   console.log("Image Request Inside ", this.imageRequests[1]);
    //   this.data.imageRequest2 = this.imageRequests[1];
    //   this.data.markov_dialog_1 = this.panelElements[0].character_name+" is "+this.panelElements[0].emotional+".He said, ";
    //   this.data.markov_dialog_2 = this.panelElements[1].character_name+" is "+this.panelElements[1].emotional+" and he said, ";
    //   this.markovGeneratedTexts.push(this.data.markov_dialog_1);
    //   this.markovGeneratedTexts.push(this.data.markov_dialog_2);
    //
    //   console.log("Character 1 name: "+this.getCharacterName(this.panelElements[0].character_name));
    //   console.log("Character 2 name: "+this.getCharacterName(this.panelElements[1].character_name));
    //   console.log(this.markovGeneratedTexts);
    // });

  }

  // async createFirstSceneHelper(state: IState) {
    // let count = 0;
    // for(let character of state.panels[0].characters){
    //   console.log("Character");
    //   if(count < 2) {
    //     count += 1;
    //     await this.getCharacterName(character["character-name"]).then(data => {
    //       const panel = {} as IPanel;
    //       panel.character_id = character["character-name"];
    //       panel.emotional = character["emotional"];
    //       panel.causality = "";
    //       panel.character_name = data['identity']['id'];
    //       console.log(panel);
    //       this.panelElements.push(panel);
    //
    //       // this.xml_data.changePanelElements(this.panelElements);
    //
    //       let imageRequest: object;
    //       imageRequest = this.getImage(panel);
    //       this.imageRequests.push(imageRequest);
    //       console.log("Image Request: ");
    //     });
    //   }
    // }
    // if(count == 1){
    //   const panel = {} as IPanel;
    //   panel.character_id = " ";
    //   panel.emotional = " ";
    //   panel.causality = " ";
    //   panel.character_name = " ";
    //   console.log(panel);
    //   this.panelElements.push(panel);
    //
    //   // this.xml_data.changePanelElements(this.panelElements);
    //
    //   let imageRequest = {} as IPanel;
    //
    //   //imageRequest = this.getImage(panel);
    //   this.imageRequests.push(imageRequest);
    //   console.log("Image Request: ");
    //   this.markovGeneratedTexts.push(" ");
    //   this.userEnteredText.push(" ");
    // }

  //}

  // getCharacterName(id: string){
  //
  //   return new Promise((resolve, reject) => {
  //     this.requestService.getName("http://narration-box.herokuapp.com/characters/"+id).subscribe(data => {
  //       resolve(data);
  //     });
  //   });
  //
  // }




}
