import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {IState} from "@app/state";
import {IPanel} from "@app/panel";
import {INextPanel} from "@app/addNextPanel";
import {CreateStoryRequestBody} from "@app/create-story-request-body";
import {RequestOptions} from "@angular/http";
import {CharacterModel} from "@app/character-model";
import {StoryViewModel} from "@app/story-view-model";
import {CreateCharacterModel} from "@app/createCharacterModel";

@Injectable({
  providedIn: 'root'
})
export class ConfigServiceService {

  // httpOptions = {
  //   headers: new HttpHeaders().set('Content-type' = 'application/json')
  // };
  // private result: Observable<Blob>;

  constructor(private http: HttpClient) { }

  createCharacter(url: string, obj: CreateCharacterModel): Observable<any>{
    let body = JSON.stringify(obj);
    let header = new HttpHeaders({'content-type': 'application/json'});
    // return this.http.post<CreateCharacterModel>(url, body, {headers: header})
    //   .pipe(
    //     catchError(this.handleError('addHero', hero))
    //   );
    return this.http.post(url, body, {headers: header});
  }

  getDefault(url: string): Observable<any>{
    return this.http.get(url);
  }

  getCharactersInfo(url: string): Observable<any>{
    return this.http.get(url);
}

  addStory(url: string, obj: CreateStoryRequestBody): Observable<IState> {
    let body = JSON.stringify(obj);
    let header = new HttpHeaders({'content-type': 'application/json'});
    // let headers = new Headers({ 'Content-Type': 'application/json' });
    // let options = new RequestOptions({ headers: headers });

    return this.http.post<IState>(url, body, {headers: header});
  }

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

  createStory(url: string, obj: CreateStoryRequestBody): Observable<any>{
    let body = JSON.stringify(obj);
    let header = new HttpHeaders({'content-type': 'application/json'});
    return this.http.post(url, body, {headers: header});
  }

  post(url: string): Observable<Object>{
    let obj = {}
    let body = JSON.stringify(obj);
    let header = new HttpHeaders({'content-type': 'application/json'});
    return this.http.post(url, body, {headers: header});
  }

  // getName(url: string): Observable<Object>{
  //   return this.http.get(url);
  // }

  getName(url: string): Observable<any>{
    return this.http.get(url);
    //return this.http.get(url);
  }

  getStory(url: string): Observable<any>{
    return this.http.get(url);
  }
}
