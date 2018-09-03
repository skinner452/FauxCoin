import { Chart } from 'chart.js';

export class Coin {
  id:number;
  name:string;
  value:number;
  value24h:number;
  chart:any;

  amount:number;

  constructor(json:any) {
    this.id = json.id;
    this.name = json.name;
    this.value = json.value;
    this.value24h = json.value24h;

    this.amount = json.amount;
  }
  
  getChange(){
    let change = this.value-this.value24h;
    change = Math.round(change*100000)/100000;
    if(change >= 0) return '+' + change;
    return change;
  }

  getPercentChange(){
    let change = (((this.value/this.value24h)-1)*100);
    change = Math.round(change*100000)/100000;
    if(change >= 0){
      return '+' + change + "%";
    } else {
      return change + "%";
    }
  }

  getColor(){
    if(this.value-this.value24h > 0){
      return "text-success";
    }
    if(this.value-this.value24h > 0){
      return "text-warning";
    }
    return "";
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