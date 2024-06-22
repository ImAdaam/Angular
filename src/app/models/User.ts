/*export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
  }
    */

  export class User {
    public id: number;
    public username: string;
    public email: string;
    public password: string;
    public fav: number[] = [];

    constructor(id: number, username: string, email: string, password: string, fav:number[] = []) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.fav = fav;
    }
}