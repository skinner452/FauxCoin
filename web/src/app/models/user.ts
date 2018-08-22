export class User {
  id:number;
  name:string;
  funds:number;

  constructor(json:any) {
    this.id = json.id;
    this.name = json.name;
    this.funds = json.funds;
  }
}
