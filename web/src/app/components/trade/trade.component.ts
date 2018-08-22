import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Coin } from '../../models/coin';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  coins:Coin[];

  constructor(private apiService:ApiService) { }

  ngOnInit() {
    this.loadCoins();
  }

  loadCoins(){
    this.apiService.getCoins().subscribe((coins) => {
      this.coins = coins;
    });
  }

}
