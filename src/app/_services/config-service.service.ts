import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import {IState} from "@app/state";
import {IPanel} from "@app/panel";
import {INextPanel} from "@app/addNextPanel";

@Injectable({
  providedIn: 'root'
})
export class ConfigServiceService {

  // private result: Observable<Blob>;

  constructor(private http: HttpClient) { }

   getConfig(url: string): Observable<Blob>  {
    // this.result = await this.http.get(url, {responseType: 'blob'})
    //   .toPromise()
    //   .then(resp => resp as Observable<Blob>);
    return this.http.get(url, {responseType: 'blob'});
  }

  getState(url: string): Observable<IState>{

    return this.http.get<IState>(url);
  }

  getPanel(url: string): Observable<IPanel>{
    return this.http.get<IPanel>(url);
  }

  post(url: string): Observable<Object>{
    return this.http.post(url,{});
  }

  // getName(url: string): Observable<Object>{
  //   return this.http.get(url);
  // }

  getName(url: string): Observable<any>{
    return this.http.get(url);
    //return this.http.get(url);
  }

}
