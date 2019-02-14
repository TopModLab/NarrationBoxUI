import {Component, OnInit} from '@angular/core';
// import {text} from "@angular/core/src/render3";
// import { FileUploader } from 'ng2-file-upload';
import {HttpClient, HttpEventType} from "@angular/common/http";
// import {text} from "@angular/core/src/render3";
//import { xml2js } from 'xml2js';
import * as xml2js from 'xml2js';
import {Parser} from 'xml2js';
import {ConfigServiceService} from "@app/_services/config-service.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload-xml.component.html',
  styleUrls: ['./upload-xml.component.css']
})
export class UploadXmlComponent implements OnInit {

  errorMessage: string = "";
  no_of_scenes: number = 0;
  scenes:any;
  xmlText: string = "";
  showContent: boolean = false;
  initial_flag: boolean = true;
  isImageLoading: boolean;
  selectedFile: File = null;
  //uploader: FileUploader = new FileUploader({ url: "api/your_upload", removeAfterUpload: false, autoUpload: true });
  //parser: DOMParser = null;
  storyTitle: string = "";
  introduction: any = "";
  messages:string[] = new Array();
  characters:string[] = new Array();
  images: string[] = new Array();
  imageRequests: object[] = new Array();


  constructor(private imageService: ConfigServiceService) {

  }

  createImageFromBlob(image: Blob, imageRequest: any) {
    let reader = new FileReader();
    //console.log(image);
    reader.addEventListener("load", () => {
      this.images.push((reader.result).toString());
      imageRequest.blob = (reader.result).toString();
    }, false);

    //console.log(this.images);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


  //code to upload filelet reader = new FileReader();

  onFileSelected(event) {
    console.log("sdfdsf");
    // const parseString = require('xml2js').parseString();
    //let characters = new Array();
    //let messages = new Array();
    let reader = new FileReader();

    this.selectedFile = <File>event.target.files[0];
    if(this.selectedFile.type == "text/xml"){
       this.errorMessage = "";
       this.initial_flag = false;
       this.showContent = true;
      reader.onload = (event) => {
        let parser = new DOMParser();
         let xmlContent = reader.result;
        console.log(xmlContent);
        console.log(typeof xmlContent);
        this.xmlText = xmlContent.toString();
        console.log("XML TEXT" + this.xmlText);

        // this.parseXML(this.xmlText).then(
        //   (data)=>{
        //     this.xmlItems = data;
        //   }
        // );

        let xmlDoc = parser.parseFromString(this.xmlText,"text/xml");
        console.log(typeof xmlDoc);
        console.log(xmlDoc);
        this.storyTitle = xmlDoc.getElementsByTagName("story")[0].getAttribute('title');
        console.log(this.storyTitle);
        this.introduction = xmlDoc.getElementsByTagName("introduction")[0].getAttribute('info');
        console.log(this.introduction);

        let chars = xmlDoc.getElementsByTagName('characters')[0].getElementsByTagName('char');
        for (let i=0; i < chars.length; i++){
          this.characters.push((chars[i].getAttribute('name')).toString());
        }
        console.log(this.characters);
        let x =
          xmlDoc.getElementsByTagName("scene");
        console.log(x);
        for (let i=0;i< x.length; i++){
          let y = x[i].getElementsByTagName('text');
          // for (let j=0; j< y.length ; j++){
          //   this.firstDialogues.add(y[j].getAttribute('info'));
          // }
          console.log(y);
          //let arr = Array.from(y);
          for (let j=0; j < y.length; j++){
            if(y[j].getAttribute('type').toString() != "comment") {
              this.messages.push(" \" " + (y[j].getAttribute('info')).toString() + " \" ");
            }
            else {
              this.messages.push((y[j].getAttribute('info')).toString());
            }
          }
          //y = x.getElement
          let k = x[i].getElementsByTagName('char');
          for(let l=0; l < k.length; l++){
            let id = k[l].getAttribute('id').toString();
            let emotion = k[l].getAttribute('emotion').toString();
            // this.config.getConfig("https://narration-box.herokuapp.com/images/"+id+"?emotion="+emotion).
            // subscribe((data: ConfigServiceService) => this.config);
            // console.log(this.config);
            this.isImageLoading = true;
            let imageRequest = {
              resolved: false,
              error: false,
              blob: null
            };

            this.imageService.getConfig("https://narration-box.herokuapp.com/images/"+id+"?emotion="+emotion).subscribe(data => {
              this.createImageFromBlob(data, imageRequest);
              this.isImageLoading = false;
              imageRequest.resolved = true;
            }, error => {
              this.isImageLoading = false;
              imageRequest.resolved = true;
              imageRequest.error = true;
              console.log(error);
            });

            this.imageRequests.push(imageRequest);
            //console.log(this.http.get("https://narration-box.herokuapp.com/images/"+id+"?emotion="+emotion));
            //console.log(this.http.get("https://narration-box.herokuapp.com/images/"+id+"?emotion="+emotion));
          }

        }
        console.log("CHARACTERS: "+ this.characters);
        console.log("Messages: "+ this.messages);
        console.log("IMAGES: "+ this.images);
        this.no_of_scenes = (this.messages.length)/4;

        this.scenes = Array(this.no_of_scenes).fill(0).map((x,i)=>i);



      }
      reader.readAsText(this.selectedFile);


    }
    else {
      this.errorMessage = " * Please upload .xml file only ";
      this.xmlText = "";

    }
    // parseString(this.xmlText, (err, result) => {
    //   console.log(result);
    // });
     console.log(this.selectedFile);
  }

  ngOnInit() {

  }

}
