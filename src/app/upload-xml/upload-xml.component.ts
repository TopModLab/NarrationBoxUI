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
  //characters: string[];
  // firstDialogues: any;
  // secondDialogues: any;
  // thirsDialogues: any;
  // fourthDialogues: any;
  // public xmlItems: any;

  constructor(private imageService: ConfigServiceService) {

  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    //console.log(image);
    reader.addEventListener("load", () => {
      this.images.push((reader.result).toString());
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
            this.messages.push((y[j].getAttribute('info')).toString());
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
            this.imageService.getConfig("https://narration-box.herokuapp.com/images/"+id+"?emotion="+emotion).subscribe(data => {
              this.createImageFromBlob(data);
              this.isImageLoading = false;
            }, error => {
              this.isImageLoading = false;
              console.log(error);
            });
            //console.log(this.http.get("https://narration-box.herokuapp.com/images/"+id+"?emotion="+emotion));
            //console.log(this.http.get("https://narration-box.herokuapp.com/images/"+id+"?emotion="+emotion));
          }

        }
        console.log("CHARACTERS: "+ this.characters);
        console.log("Messages: "+ this.messages);
        console.log("IMAGES: "+ this.images);
        this.no_of_scenes = (this.messages.length)/4;

        this.scenes = Array(this.no_of_scenes).fill(0).map((x,i)=>i);

        // get images by get request



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

  // code to upload file
  // onUpload(){
  //   const fd = new FormData();
  //   fd.append('xml', this.selectedFile, this.selectedFile.name);
  //   this.http.post('localhost:8000/upload', fd, {
  //     reportProgress: true,
  //     observe:'events'
  //   })
  //     .subscribe(event => {
  //       if (event.type === HttpEventType.UploadProgress){
  //         console.log('Upload Progress: '+ event.loaded / event.total * 100 + '%');
  //       }
  //       else if(event.type === HttpEventType.Response){
  //         console.log(event);
  //       }
  //
  //     });
  // }

  // parseXML(data)
  // {
  //   return new Promise(resolve =>
  //   {
  //     let k,
  //       arr    = [],
  //       parser = new xml2js.Parser(
  //         {
  //           trim: true,
  //           explicitArray: true
  //         });
  //
  //     parser.parseString(data, function (err, result)
  //     {
  //       let obj = result.story;
  //       for(k in obj.scene)
  //       {
  //         let item = obj.scene[k];
  //         arr.push({
  //           image1           : item.image1[0],
  //           image2           : item.image2[0],
  //           dialogue1        : item.dialogue1[0],
  //           dialogue2        : item.dialogue2[0],
  //           dialogue3        : item.dialogue3[0],
  //           dialogue4        : item.dialogue4[0]
  //         });
  //       }
  //
  //       resolve(arr);
  //     });
  //   });
  // }

  StoryTitle(){
    return this.storyTitle;
  }

  ngOnInit() {

  }

}
