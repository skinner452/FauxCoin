export class Coin {
  id:number;
  name:string;
  value:number;
  value24h:number;

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
}