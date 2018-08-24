import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Coin } from '../../models/coin';
import { Chart } from 'chart.js';

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

      // get coin values for top 3
      let i = 0;
      let max = 3;
      let colors = ['#3cba9f','#ffcc00','#d73030'];
      coins.forEach(coin => {
        if(i < max){
          let color = colors[i];

          this.apiService.getCoinValues(coin.id).subscribe((values) => {
            let dates = values.map(value => value.date);
            let data = values.map(value => value.value);

            let labels = [];
            dates.forEach(date => {
              date = new Date(date);
              labels.push(date.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
            });

            coin.chart = new Chart('coin-chart-' + coin.id, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [
                  {
                    data: data,
                    borderColor: color,
                    fill: false,
                    pointRadius: 0
                  }
                ]
              },
              options: {
                legend: {
                  display: false
                },
                scales: {
                  xAxes: [{
                    display: false
                  }],
                  yAxes: [{
                    display: true
                  }],
                },
                
              }
            });
          });
          i++;
        }
      });
    });
  }

}
