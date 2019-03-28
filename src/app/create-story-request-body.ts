export class CreateStoryRequestBody {

  title: string;
  id: string;
  charactersInStory: string[];

  constructor(charactersInStory: string[],id: string, title: string){
    this.charactersInStory = charactersInStory;
    this.id = id;
    this.title = title;
  }
}
