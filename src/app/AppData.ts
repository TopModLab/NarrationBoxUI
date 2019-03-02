// AppData.ts

export class AppData {
  constructor(
    public user_entered_dialogue1: string,
    public user_entered_dialogue2: string,
    public markov_dialog_1: string,
    public markov_dialog_2: string,
    public imageRequest1: object,
    public imageRequest2: object
  ) {}
}
