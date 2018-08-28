import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { User } from '../models/user';
import { Coin } from '../models/coin';
import { Trade } from '../models/trade';

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
    return this.http.get(url).pipe(map(res => {
      if(res.json().data){
        return new User(res.json().data.user);
      } else {
        return null;
      }
    }));
  }

  getUserValues(userId:number): Observable<any[]>{
    let url:string = API_URL + "/users/" + userId + "/values";
    return this.http.get(url).pipe(map(res => {
      let values = [];
      if(res.json().data){
        values = res.json().data.values;
      }
      return values;
    }));
  }

  getCoin(id:number): Observable<Coin>{
    let url:string = API_URL + "/coins/" + id;
    return this.http.get(url).pipe(map(res => {
      if(res.json().data){
        return new Coin(res.json().data.coin);
      } else {
        return null;
      }
    }));
  }

  getCoins(): Observable<Coin[]>{
    let url:string = API_URL + "/coins";
    return this.http.get(url).pipe(map(res => {
      let coins = [];
      if(res.json().data){
        let array = res.json().data.coins;
        array.forEach(object => {
          coins.push(new Coin(object));
        });
      }
      return coins;
    }));
  }

  getCoinValues(coinId:number): Observable<any[]>{
    let url:string = API_URL + "/coins/" + coinId + "/values";
    return this.http.get(url).pipe(map(res => {
      let values = [];
      if(res.json().data){
        values = res.json().data.values;
      }
      return values;
    }));
  }

  getTrades(args:Object): Observable<Trade[]>{
    let url:string = API_URL + "/trades" + this.getQueryParams(args);
    return this.http.get(url).pipe(map(res => {
      let trades = [];
      if(res.json().data){
        let array = res.json().data.trades;
        array.forEach(object => {
          trades.push(new Trade(object));
        });
      }
      return trades;
    }));
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

  private getQueryParams(args): String{
    let params = [];
    for(let key in args){
      params.push(key + "=" + args[key]);
    }
    if(params.length){
      return "?" + params.join("&");
    } else {
      return "";
    }
  }
}
