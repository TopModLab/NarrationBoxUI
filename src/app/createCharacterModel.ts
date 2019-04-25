import {IdentityModel} from "@app/identityModel";
import {PersonalityModel} from "@app/personalityModel";
import {RelationModel} from "@app/relationModel";

export class CreateCharacterModel{

  constructor(gender, id, identity, personality, prob, relations, stateIds){
    this.gender = gender;
    this.id = id;
    this.identity = identity;
    this.personality = personality;
    this.probabilityOfOccurence = prob;
    this.relations = relations;
    this.stateIds = stateIds;
  }
  public gender: string;
  public id: string;
  public identity: IdentityModel;
  public personality: PersonalityModel;
  public probabilityOfOccurence: number;
  public relations: RelationModel[];
  public stateIds: string[];
}
