import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-xml',
  templateUrl: './upload-xml.component.html',
  styleUrls: ['./upload-xml.component.css']
})
export class UploadXmlComponent implements OnInit {

  xml = new XMLHttpRequest();


  constructor() { }

  ngOnInit() {
  }



}
