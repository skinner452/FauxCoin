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
  sellModel = new Object();

  constructor(private route: ActivatedRoute, private apiService:ApiService) { }

  ngOnInit() {
    this.loadCoins();
    this.loadUser();
    this.route.params.subscribe((params) => {
      this.coinId = params['coinId'];
      this.loadCoin();
    });
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

  loadCoin(){
    if(this.coinId){
      this.apiService.getUserCoin(1,this.coinId).subscribe((coin) => {
        this.coin = coin;
        this.coin.createChart(this.apiService,'#3cba9f');

        this.buyModel['value'] = coin.value;
        this.updateBuyTotal();

        this.sellModel['value'] = coin.value;
        this.updateSellTotal();
      });
      this.apiService.getTrades({coinId:this.coinId}).subscribe((trades) => {
        this.trades = trades;
      });
    }
  }

  updateBuyTotal(){
    let value = Number(this.buyModel['value']);
    let amount = Number(this.buyModel['amount']);
    this.buyModel['total'] = value*amount*1.01;
  }

  updateSellTotal(){
    let value = Number(this.sellModel['value']);
    let amount = Number(this.sellModel['amount']);
    this.sellModel['total'] = value*amount*1.01;
  }

  onBuy(){
    this.apiService.buyCoin(this.coinId,this.buyModel['amount']).subscribe((resp) => {
      if(resp['status'] == 'success'){
        this.buyModel['value'] = '';
        this.buyModel['amount'] = '';
        this.buyModel['total'] = '';
        this.loadCoin();
        this.loadUser();
      }
    });
  }

  onSell(){
    this.apiService.sellCoin(this.coinId,this.sellModel['amount']).subscribe((resp) => {
      if(resp['status'] == 'success'){
        this.sellModel['value'] = '';
        this.sellModel['amount'] = '';
        this.sellModel['total'] = '';
        this.loadCoin();
        this.loadUser();
      }
    });
  }
}
