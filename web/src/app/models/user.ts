import { Chart } from 'chart.js';

export class User {
  id:number;
  name:string;
  funds:number;
  value:number;
  chart:any;

  constructor(json:any) {
    this.id = json.id;
    this.name = json.name;
    this.funds = json.funds;
    this.value = json.value;
  }

  createChart(apiService,color){
    apiService.getUserValues(this.id).subscribe((values) => {
      let dates = values.map(value => value.date);
      let data = values.map(value => value.value);
    
      let labels = [];
      dates.forEach(date => {
        date = new Date(date);
        labels.push(date.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
      });
    
      this.chart = new Chart('user-chart', {
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
          maintainAspectRatio: false,
        }
      });
    });
  }
}
