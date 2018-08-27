import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Coin } from '../../models/coin';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  coinId:number;

  coins:Coin[];
  coin:Coin;

  constructor(private route: ActivatedRoute, private apiService:ApiService) { }

  ngOnInit() {
    this.coinId = this.route.snapshot.params['coinId'];
    this.loadCoins();
    this.loadCoin();
  }

  loadCoins(){
    this.apiService.getCoins().subscribe((coins) => {
      this.coins = coins;
    });
  }

  loadCoin(){
    if(this.coinId){
      this.apiService.getCoin(this.coinId).subscribe((coin) => {
        this.coin = coin;
        this.coin.createChart(this.apiService,'#3cba9f')
      })
    }
  }

}
