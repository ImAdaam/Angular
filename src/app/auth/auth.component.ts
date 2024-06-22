import { Component } from '@angular/core';
import { InMemoryDataService } from '../in-memory-data.service';
import { User } from '../models/User';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginForm = true;
  isRegisterForm = false;
  showForms = true; // Változó hozzáadása, alapértelmezett érték: true

  loginEmail: string = '';
  loginPassword: string = '';

  registerUsername: string = '';
  registerEmail: string = '';
  registerPassword: string = '';

  constructor(private inMemoryDataService: InMemoryDataService, private authService: AuthService, private router: Router) {}

  toggleForms(formType: string): void {
    this.isLoginForm = formType === 'login';
    this.isRegisterForm = formType === 'register';
  }

  onLogin(): void {
    const loginResult = this.authService.login(this.loginEmail, this.loginPassword);
    if (loginResult) {
      console.log('Sikeres bejelentkezés');
      this.router.navigate(['user']);
      // Navigálás a kezdőoldalra vagy másik védett oldalra
    } else {
      console.log('Sikertelen bejelentkezés');
      // Hibaüzenet megjelenítése
    }
  }

  onRegister(): void {
    const newUser: User = {
      id: 0, // Az ID-t a szolgáltatás generálja
      username: this.registerUsername,
      email: this.registerEmail,
      password: this.registerPassword
    };
    this.inMemoryDataService.addUser(newUser);
    this.isLoginForm = true;
    this.isRegisterForm = false;
    console.log('Regisztráció adatok:', newUser);
  }
}






