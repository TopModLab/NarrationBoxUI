import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { FinalStoryComponent } from './final-story/final-story.component';
import { StoryBuilderComponent} from './story-builder/story-builder.component';
import { AboutUsComponent} from './about-us/about-us.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'introduction', component: IntroductionComponent },
  { path: 'final-story', component: FinalStoryComponent },
  { path: 'story-builder', component: StoryBuilderComponent },
  { path: 'about-us', component: AboutUsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
