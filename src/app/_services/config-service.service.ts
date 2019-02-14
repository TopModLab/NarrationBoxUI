import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

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
}
