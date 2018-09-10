export class Trade {
  coinId:number;
  userId:number;
  type:number;
  amount:number;
  coinValue:number;
  date:string;

  constructor(json:any) {
    this.coinId = json.coin_id;
    this.userId = json.user_id;
    this.type = json.type;
    this.amount = json.amount;
    this.coinValue = json.coin_value;
    this.date = json.date;
  }

  getTotal(){
    return Math.round((this.amount * this.coinValue)*100000)/100000;
  }

  getRowClass(){
    if(this.type == 1) return "table-success";
    if(this.type == 2) return "table-danger";
    return "";
  }

  getAmount(){
    return Math.round(this.amount*100000)/100000;
  }

  getCoinValue(){
    return Math.round(this.coinValue*100000)/100000;
  }
}