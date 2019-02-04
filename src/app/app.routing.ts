import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import {IntroductionComponent} from "@app/introduction/introduction.component";
import {StoryBuilderComponent} from "@app/story-builder/story-builder.component";
import {FinalStoryComponent} from "@app/final-story/final-story.component";
import {UploadXmlComponent} from '@app/upload-xml/upload-xml.component';
import {DownloadXMLComponent} from "@app/download-xml/download-xml.component";
import {DownloadHtmlComponent} from "@app/download-html/download-html.component";
// import {DialogComponent} from "@app/upload/dialog/dialog.component";

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'introduction', component: IntroductionComponent},
    { path: 'story-builder', component: StoryBuilderComponent},
    { path: 'final-story', component: FinalStoryComponent},
    { path: 'upload-xml', component: UploadXmlComponent},
    { path: 'download-xml', component: DownloadXMLComponent},
    { path: 'download-html', component: DownloadHtmlComponent},
    // { path: 'upload', component: DialogComponent},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
