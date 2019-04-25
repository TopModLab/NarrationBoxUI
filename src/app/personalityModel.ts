export class PersonalityModel{

  constructor(weight, descID, like_score, matrix){
    this.impactWeight = weight;
    this.likenessScore = like_score;
    this.matrix = matrix;
    this.stateDescriptorId = descID;
  }
  public impactWeight: number;
  public likenessScore: number;
  public matrix: any[];
  public stateDescriptorId: string;
}
