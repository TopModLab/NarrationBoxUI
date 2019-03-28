import {CharacterModel} from "@app/character-model";

export class SceneModel {
  constructor(){
    this.characters = new Array<CharacterModel>();
  }
  public characters: Array<CharacterModel>;
}
