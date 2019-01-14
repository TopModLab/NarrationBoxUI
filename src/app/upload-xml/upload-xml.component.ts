import {Component, OnInit} from '@angular/core';
// import {text} from "@angular/core/src/render3";
// import { FileUploader } from 'ng2-file-upload';
import {HttpClient, HttpEventType} from "@angular/common/http";
// import {text} from "@angular/core/src/render3";
//import { xml2js } from 'xml2js';
import * as xml2js from 'xml2js';
import {Parser} from 'xml2js';


@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload-xml.component.html',
  styleUrls: ['./upload-xml.component.css']
})
export class UploadXmlComponent implements OnInit {

  errorMessage: string = "";
  xmlText: string = "";
  selectedFile: File = null;
  //uploader: FileUploader = new FileUploader({ url: "api/your_upload", removeAfterUpload: false, autoUpload: true });
  //parser: DOMParser = null;

  introduction: any = "";
  // public xmlItems: any;

  constructor(private http: HttpClient) {

  }



  //code to upload filelet reader = new FileReader();

  onFileSelected(event) {
    console.log("sdfdsf");
    // const parseString = require('xml2js').parseString();

    let reader = new FileReader();
    this.selectedFile = <File>event.target.files[0];
    if(this.selectedFile.type == "text/xml"){
       this.errorMessage = "";
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
        let txt = "";
        let x =
          xmlDoc.getElementsByTagName("scene");
        for (let i=0;i< x.length; i++){
          txt += x[i].getAttribute('id') + "<br>";
        }

        console.log(txt);
        // this.introduction = xmlDoc.getElementsByTagName("scene");
        //
        // console.log(this.introduction);

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

  ngOnInit() {

  }
}
