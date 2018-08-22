import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { Coin } from '../../models/coin';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user:User;
  coins:Coin[];

  constructor(private apiService:ApiService) { }

  ngOnInit() {
    this.loadUser();
    this.loadCoins();
  }

  loadUser(){
    this.apiService.getUser(1).subscribe((user) => {
      this.user = user;
    });
  }

  loadCoins(){
    this.apiService.getCoins().subscribe((coins) => {
      this.coins = coins;
    });
  }

  buyCoin(coin:Coin){
    this.apiService.buyCoin(coin.id,1).subscribe((resp) => {
      if(resp['status'] == 'success'){
        this.loadCoins();
        this.loadUser();
      } else {
        alert(resp['message']);
      }
    });
  }
  
  sellCoin(coin:Coin){
    this.apiService.sellCoin(coin.id,1).subscribe((resp) => {
      if(resp['status'] == 'success'){
        this.loadCoins();
        this.loadUser();
      } else {
        alert(resp['message']);
      }
    });
  }
}
