import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { StoryBuilderComponent } from './story-builder/story-builder.component';
import { FinalStoryComponent } from './final-story/final-story.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroductionComponent,
    StoryBuilderComponent,
    FinalStoryComponent,
    AboutUsComponent,
    NavComponent,
    HomeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
