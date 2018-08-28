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
    return this.amount * this.coinValue;
  }
}