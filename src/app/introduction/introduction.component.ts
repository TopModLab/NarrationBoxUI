import { Component, OnInit } from '@angular/core';
import {XMLData} from "@app/XMLData";
import {MatRadioModule} from '@angular/material/radio';
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
import {async} from "rxjs/internal/scheduler/async";
import {CreateCharacterModel} from "@app/createCharacterModel";
import {IdentityModel} from "@app/identityModel";
import {PersonalityModel} from "@app/personalityModel";
import {RelationModel} from "@app/relationModel";

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
  characterInfoMode: boolean = false;
  characterRelationsMode: boolean = false;

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

  public checkBoxes: boolean[] = new Array();

  //public charactersInStory: string[] = new Array();
  public title: string;
  public user_story_ids: string[] = new Array();

  public characterRelationMatrix: number[][] = new Array();

  // public create_story_request: CreateStoryRequestBody();

  // public defaults: string[] = ["assets/img/shark_default.png", "assets/img/octopus_default.png",
  //   "assets/img/sealion_default.png", "assets/img/seaturtle_default.png", "assets/img/starfish_default.png","assets/img/oyester_default.png", "assets/img/fish_default.png"];

  public testCharacters: CharacterModel[] = new Array();

  public defaults: string[] = ["assets/img/shark_default.png", "assets/img/octopus_default.png", "assets/img/sealion_default.png"];
  public defaultImgs: any[] = new Array();

  public CharacterIdToNameMap = new Map();
  //public CharacterIdToTitle = new Map();
  //public CharacterIdToGender = new Map();
  //public CharacterIdToSociability = new Map();

  public UuidToImageNameMap = new Map();
  public UuidToCheckBoxMap = new Map();
  // declarations for new elements
  public number_of_chars_in_selected_tab: number;
  public default_images_in_selected_tab: any[] = new Array();
  public category_ids: any[] = new Array();

  constructor(private xml_data: DataService, private requestService: ConfigServiceService) { }


  // use ngOnInit and populateMap to generate statements for the actors in the display screen.
  ngOnInit() {

    // make get request based on selected tab.
    let url ="http://narration-box.herokuapp.com/images/ids";
    this.requestService.getCharactersInfo(url).subscribe(data => {
          this.loadDefault(data).then(data=> {

            }
          );
      }

    );

    // url = "http://narration-box.herokuapp.com/images/default";
    // this.requestService.getDefault(url).subscribe(data => {
    //   this.loadDefault(data);
    // });

  }

  async loadDefault(data: any){
    console.log("Start Load Default");
    console.log(data);
    this.number_of_chars_in_selected_tab = data.length;
    console.log(data.length);
    let char_array = new Array<CharacterModel>();

    this.checkBoxes = [];

    for(let item of data){

      console.log(item);
      this.checkBoxes.push(false);
      let char = new CharacterModel();
      char.character_name = item;
      char.character_id = uuid();

      this.category_ids.push(item.toString());
      this.UuidToImageNameMap.set(char.character_id, char.character_name);
      //this.UuidToCheckBoxMap.set(char.character_id, );
      let imageRequest = {
        resolved: false,
        error: false,
        blob: null
      };

      await this.getDefaultImage(char).then(data =>
        {
          char.image = data.blob;
          console.log("CHARACTER IMAge ===  ",char.image);
          this.default_images_in_selected_tab.push(data);
          char_array.push(char);
        }

      );

      //imageRequest = this.getDefaultImage(char);
      //this.createImageFromBlob(item.file, imageRequest);
      //this.default_images_in_selected_tab.push(imageRequest.blob);

      //this.default_images_in_selected_tab.push(item.file);
    }

    // this.number_of_chars_in_selected_tab = response.length;
    //
    //   for(let item of response){
    //     let imageRequest = {
    //       resolved: false,
    //       error: false,
    //       blob: null
    //     };
    //
    //
    //
    //     this.createImageFromBlob(response, imageRequest);
    //     this.default_images_in_selected_tab.push(imageRequest.blob);
      }


  async populateMap(response: any){
    console.log("Start Populate Map");
    console.log(response);
    this.number_of_chars_in_selected_tab = response.length;
    console.log(response.length);

    let url = "http://narration-box.herokuapp.com/images/default";

    this.requestService.getDefault(url).subscribe(data => {
        console.log(data);
        this.loadDefault(data).then(data =>
        {

        });


    });
   //  for(let item of response){
   //
   //    let url = "http://narration-box.herokuapp.com/images/"+item.toString()+"?emotion=default";
   //
   //    console.log(item);
   //
   //    this.requestService.getDefault(url).subscribe(data => {
   //      let imageRequest = {
   //        resolved: false,
   //        error: false,
   //        blob: null
   //      };
   //      this.createImageFromBlob(data, imageRequest);
   //      this.default_images_in_selected_tab.push(imageRequest.blob);
   //       });
   //    //this.CharacterIdToTitle.set(response[item].id, response[item].identity.title);
   //   //this.CharacterIdToNameMap.set(response[item].id, response[item].identity.id);
   //   //this.CharacterIdToGender.set(response[item].id, response[item].gender);
   //   //this.CharacterIdToSociability.set(response[item].id, Number(1-response[item].personality[0].impactWeight).toFixed(2));
   //
   // }


    // console.log(this.CharacterIdToNameMap);
    // console.log(this.CharacterIdToTitle);
    // console.log(this.CharacterIdToGender);
    // console.log(this.CharacterIdToSociability);
  }

  backToCharSelection(){
    this.introductionMode = true;
    this.selectionMode = false;
    this.buildMode = false;
    this.characterInfoMode = false;
    this.viewXMLMode = false;
    this.viewHTMLMode = false;
    this.characterRelationsMode = false;
  }

  backToCharInfo(){
    this.introductionMode = false;
    this.selectionMode = false;
    this.buildMode = false;
    this.characterInfoMode = true;
    this.viewXMLMode = false;
    this.viewHTMLMode = false;
    this.characterRelationsMode = false;
  }

  getCharacterRelations(){
    this.introductionMode = false;
    this.selectionMode = false;
    this.buildMode = false;
    this.characterInfoMode = false;
    this.viewXMLMode = false;
    this.viewHTMLMode = false;
    this.characterRelationsMode = true;

    console.log(this.testCharacters);
    console.log("GENDER char 1", this.testCharacters[0].gender);
    console.log("GENDER char 2", this.testCharacters[1].gender);
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
    console.log("Default called.")
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

  async getImage(character: CharacterModel) {
    let flag = false;
    this.isImageLoading = true;
    let imageRequest = {
      resolved: false,
      error: false,
      blob: null
    };

    let url = "https://narration-box.herokuapp.com/images/" + character.character_name + "?emotion=" + character.emotional;
    console.log(url);
    console.log("Initial image request started")
    await this.requestService.getConfig(url).subscribe(data => {
      console.log("INSIDE CALLBACK");
      if (data.size > 0) {

        this.createImageFromBlob(data, imageRequest);
        this.isImageLoading = false;
        imageRequest.resolved = true;
      }
      else{
        flag = true;
      }
      // } else {
      //   return this.getDefaultImage(character);
      // }

    }, error => {
      this.isImageLoading = false;
      imageRequest.resolved = true;
      imageRequest.error = true;
      console.log(error);
    });
    console.log("Initial Image request completed");
    if (flag) {
      let url = "https://narration-box.herokuapp.com/images/" + character.character_name + "?emotion=default";

      this.requestService.getConfig(url).subscribe(data => {
        if (data.size > 0) {

          this.createImageFromBlob(data, imageRequest);
          this.isImageLoading = false;
          imageRequest.resolved = true;
        }
      });

      return imageRequest;
    }
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
        //character.markov_generated = character.character_name + " is " + character.emotional + " because of " + character.emotional_causality + ". He said";
        character.markov_generated = character['state_text']+",";

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
    this.characterInfoMode = false;

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
    this.characterInfoMode = false;

    console.log(this.story);
  }

  viewXMLClicked(){
    this.introductionMode = false;
    this.selectionMode = false;
    this.buildMode = false;
    this.viewXMLMode = true;
    this.viewHTMLMode = false;
    this.characterInfoMode = false;
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

  startStory(){

    this.introductionMode = false;
    this.selectionMode = false;
    this.buildMode = true;
    this.characterInfoMode = false;
    this.viewXMLMode = false;
    this.viewHTMLMode = false;
    this.characterRelationsMode = false;

    console.log(this.characterRelationMatrix);

    // call create character for each character.

    this.testCharacters.forEach((item, index) => {

      let empty_array: number[][];
      //let temp: number[] = new Array();
      //empty_array.push(temp);
      let char_rel_array: RelationModel[] = new Array();

      for (let i = 0, len = this.testCharacters.length; i < len; i++) {
        if(this.testCharacters[i].character_id != item.character_id){

          let char_personality_array: PersonalityModel[] = new Array();
          //console.log(item.soci)
          let temp_pers: PersonalityModel = new PersonalityModel((1-(1-(item.sociability/100)))/(len-1), "emotional", this.characterRelationMatrix[index][i]/100, empty_array);
          char_personality_array.push(temp_pers);
          let temp_rel: RelationModel= new RelationModel(this.testCharacters[i].character_id, char_personality_array);
          char_rel_array.push(temp_rel);
        }
      }

      let state_ids:string[] = new Array();
      state_ids.push("emotional");
      let org_id = this.UuidToImageNameMap.get(item.character_id);
      let char_identity = new IdentityModel(org_id, "", item.character_name);

      console.log("CHARACTER NAME: "+item.character_name);
      let char_personality = new PersonalityModel(1-(item.sociability)/100, "emotional", this.characterRelationMatrix[index][index]/100, empty_array);
      let char_request: CreateCharacterModel = new CreateCharacterModel(item.gender, item.character_id, char_identity, char_personality, 0.5, char_rel_array, state_ids);

      //char_request.gender = item.gender;
      //char_request.id = item.character_id;
      //char_identity = new IdentityModel(item.character_id, "", );
      //char_request.
      console.log(char_request);
      this.requestService.createCharacter("http://narration-box.herokuapp.com/characters/", char_request).subscribe();
    });
    // for(let item of this.testCharacters){
    //   // post request
    //
    //   let org_id = this.UuidToImageNameMap.get(item.character_id);
    //
    //   let char_identity = new IdentityModel(org_id, "", item.character_name);
    //   let char_personality = new PersonalityModel(1-item.sociability, "emotional", this.characterRelationMatrix[_i][_i]);
    //   let char_request: CreateCharacterModel = new CreateCharacterModel(item.gender, item.character_id, char_identity,  );
    //
    //   //char_request.gender = item.gender;
    //   //char_request.id = item.character_id;
    //   //char_identity = new IdentityModel(item.character_id, "", );
    //   //char_request.
    //
    //   this.requestService.createCharacter("http://narration-box.herokuapp.com/characters/", char_request);
    // }

  }

  async generateStory(){

    this.introductionMode = false;
    this.selectionMode = false;
    this.buildMode = false;
    this.characterInfoMode = true;
    this.viewXMLMode = false;
    this.viewHTMLMode = false;
    this.characterRelationsMode = false;

    //this.loading = true;
    this.testCharacters = [];

    // for each selected character make a body for post request to create a character.



    let charactersInStory: string[] = new Array();
    for(let i=0; i<this.checkBoxes.length;i++) {
      //let c: string;

      if (this.checkBoxes[i] == true) {
        //c = (i + 1).toString();
        //charactersInStory.push(c);
        let char: CharacterModel = new CharacterModel();


        // get default image from the server and add to char.image.
        //get default for the id


        // required for the get Default method.
        char.character_name = this.category_ids[i];
        char.character_id = uuid();
        await this.getDefaultImage(char).then(data =>
          {
            char.image = data;
            this.testCharacters.push(char);
            charactersInStory.push(char.character_id);
            //console.log("CHARACTER IMAge ===  ",char.image);
            //this.default_images_in_selected_tab.push(data);
            //char_array.push(char);
          }

        );

      }

    }
    // this.characterRelationMatrix = this.makeArray(this.testCharacters.length, this.testCharacters.length, 0.5);

    console.log(this.testCharacters.length);
    //let charMatrix: number[][] = new Array();
    //console.log(charMatrix);
    for(let i = 0; i < this.testCharacters.length; i++) {

      //let test_identity:IdentityModel = new IdentityModel(id, "", title);

      //let obj:CreateCharacterModel = new CreateCharacterModel("male", this.testCharacters[i].character_id, );
      let url = "";
      //this.requestService.createCharacter(url, obj);
      this.characterRelationMatrix.push(new Array(this.testCharacters.length).fill(0.5));

    }

    console.log(this.characterRelationMatrix);
    console.log(this.characterRelationMatrix[0][0]);



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
      // this.requestService.addStory("http://narration-box.herokuapp.com/stories/", create_story_request).subscribe (data => {
      //   this.createFirstScene(data);
      // });

    // this.number_of_scenes += 1;

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
          // character.markov_generated = character.character_name + " is " + character.emotional + ". He said, ";
          character.markov_generated = character['state_text']+",";

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
