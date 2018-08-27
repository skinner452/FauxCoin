import { Chart } from 'chart.js';

export class Coin {
  id:number;
  name:string;
  value:number;
  value24h:number;
  chart:any;

  constructor(json:any) {
    this.id = json.id;
    this.name = json.name;
    this.value = json.value;
    this.value24h = json.value24h;
  }
  
  getChange(){
    let change = this.value-this.value24h;
    if(change >= 0) return '+' + change;
    return change;
  }

  createChart(apiService,color){
    apiService.getCoinValues(this.id).subscribe((values) => {
      let dates = values.map(value => value.date);
      let data = values.map(value => value.value);
    
      let labels = [];
      dates.forEach(date => {
        date = new Date(date);
        labels.push(date.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
      });
    
      this.chart = new Chart('coin-chart-' + this.id, {
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
          }
        }
      });
    });
  }
}