export class CreateStoryRequestBody {

  title: string;
  id: string;
  charactersInStory: string[];

  constructor(title: string, id: string, charactersInStory: string[]){
    this.charactersInStory = charactersInStory;
    this.id = id;
    this.title = title;
  }
}
