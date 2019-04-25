import {PersonalityModel} from "@app/personalityModel";

export class RelationModel{

  constructor(byChar, PM_array){
    this.byCharacter = byChar;
    this.impact = PM_array;
    //this.impact = new Array<PersonalityModel>();
  }
  public byCharacter: string;
  public impact: PersonalityModel[];
}
