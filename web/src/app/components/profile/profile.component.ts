import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { Coin } from '../../models/coin';
import { Trade } from '../../models/trade';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:User;
  coins:Coin[];
  trades:Trade[];
  tradeCount:Number;

  constructor(private apiService:ApiService) { }

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.apiService.getUser(1).subscribe((user) => {
      this.user = user;
      user.createChart(this.apiService,'#000000');

      this.loadCoins(user.id);
      this.loadTrades(user.id);
      this.loadTradeCount(user.id)
    });
  }

  loadCoins(userId) {
    this.apiService.getUserCoins(userId,{limit:3}).subscribe((coins) => {
      this.coins = coins
    })
  }

  loadTrades(userId) {
    this.apiService.getTrades({userId:userId,limit:3}).subscribe((trades) => {
      this.trades = trades
    })
  }

  loadTradeCount(userId){
    this.apiService.getTradeCount({userId:userId}).subscribe((count) => {
      this.tradeCount = count
    })
  }

}
