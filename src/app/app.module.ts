import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';;
import { IntroductionComponent } from './introduction/introduction.component'
;
import { StoryBuilderComponent } from './story-builder/story-builder.component'
;
import { FinalStoryComponent } from './final-story/final-story.component'
;
import { UploadXmlComponent } from './upload-xml/upload-xml.component'
import {UploadModule} from "@app/upload/upload.module";
// import {Parser} from 'xml2js';

import { FileUploadModule } from 'ng2-file-upload';
import {ConfigServiceService} from "@app/_services/config-service.service";;
import { DownloadXMLComponent } from './download-xml/download-xml.component'
;
import { DownloadHtmlComponent } from './download-html/download-html.component'

// import {DialogComponent} from "@app/upload/dialog/dialog.component";
@NgModule({
    imports: [
        BrowserModule,
        UploadModule,
        ReactiveFormsModule,
        HttpClientModule,
        FileUploadModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        // DialogComponent,
        RegisterComponent
,
        IntroductionComponent
,
        StoryBuilderComponent ,
        FinalStoryComponent ,
        UploadXmlComponent ,
        DownloadXMLComponent ,
        DownloadHtmlComponent],
    providers: [
        ConfigServiceService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
