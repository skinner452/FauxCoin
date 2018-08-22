import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Coin } from '../../models/coin';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
