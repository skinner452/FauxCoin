import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Coin } from '../../models/coin';
import { User } from '../../models/user';
import { Trade } from '../../models/trade';

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
  user:User;
  trades:Trade[];

  buyModel = new Object();

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
      this.apiService.getUser(1).subscribe((user) => {
        this.user = user;
      });
      this.apiService.getCoin(this.coinId).subscribe((coin) => {
        this.coin = coin;
        this.coin.createChart(this.apiService,'#3cba9f');

        this.buyModel['value'] = coin.value;
        this.updateBuyTotal();
      });
      this.apiService.getTrades({coinId:this.coinId}).subscribe((trades) => {
        this.trades = trades;
      });
    }
  }

  updateBuyTotal(){
    let value = Number(this.buyModel['value']);
    let amount = Number(this.buyModel['amount'])
    this.buyModel['total'] = value*amount*1.01;
  }

  onBuy(){
    this.apiService.buyCoin(this.coinId,this.buyModel['amount']).subscribe((resp) => {
      if(resp['status'] == 'success'){
        this.buyModel['value'] = '';
        this.buyModel['amount'] = '';
        this.buyModel['total'] = '';
        this.loadCoin();
      }
    });
  }
}
