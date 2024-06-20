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

    constructor(id: number, username: string, email: string, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}