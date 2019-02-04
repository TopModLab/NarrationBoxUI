import { Component, OnInit } from '@angular/core';
import { Input} from "@angular/core";
 import {UploadXmlComponent} from "@app/upload-xml/upload-xml.component";
 import {ConfigServiceService} from "@app/_services/config-service.service";
 import {HttpClient} from "@angular/common/http";

 @Component({
   selector: 'app-download-html',
   templateUrl: './download-html.component.html',
   styleUrls: ['./download-html.component.css']
 })
 export class DownloadHtmlComponent implements OnInit{

   storyTitle: string;
   //private http: HttpClient;


   constructor() {


   }

   ngOnInit() {
     //this.storyTitle = UploadXmlComponent.StoryTitle();
   }

}
