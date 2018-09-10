import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Coin } from '../../models/coin';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user:User;
  coins:Coin[];

  constructor(private apiService:ApiService) { }

  ngOnInit() {
    this.loadUser();
    this.loadCoins();
  }

  loadUser() {
    this.apiService.getUser(1).subscribe((user) => {
      this.user = user;

      user.createChart(this.apiService,'#000000');
    });
  }

  loadCoins(){
    this.apiService.getCoins().subscribe((coins) => {
      this.coins = coins;

      // get coin charts for top 3
      let i = 0;
      let max = 3;
      let colors = ['#3cba9f','#ffcc00','#d73030'];
      coins.forEach(coin => {
        if(i < max){
          let color = colors[i++];
          coin.createChart(this.apiService,color);
        }
      });
    });
  }

}
