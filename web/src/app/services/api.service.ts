import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { User } from '../models/user';
import { Coin } from '../models/coin';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http:Http) { 
    console.log("API Connected");
  }

  getUser(id:number): Observable<User>{
    let url:string = API_URL + "/users/" + id;
    return this.http.get(url).pipe(map(res => res.json().data.user as User));
  }

  getCoins(): Observable<Coin[]>{
    let url:string = API_URL + "/coins";
    return this.http.get(url).pipe(map(res => res.json().data.coins as Coin[]));
  }

  buyCoin(coinId:number,amount:number): Observable<JSON>{
    let url:string = API_URL + "/buy/" + coinId;
    let body:object = {
      amount:amount
    };
    return this.http.post(url,body).pipe(map(res => res.json()));
  }

  sellCoin(coinId:number,amount:number): Observable<JSON>{
    let url:string = API_URL + "/sell/" + coinId;
    let body:object = {
      amount:amount
    };
    return this.http.post(url,body).pipe(map(res => res.json()));
  }
}