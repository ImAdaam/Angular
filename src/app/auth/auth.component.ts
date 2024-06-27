import {Component} from '@angular/core';
import {InMemoryDataService} from '../in-memory-data.service';
import {User} from '../models/User';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
    providers: [MessageService]
})
export class AuthComponent {
    isLoginForm = true;
    isRegisterForm = false;
    showForms = true; // Változó hozzáadása, alapértelmezett érték: false

    loginEmail: string = '';
    loginPassword: string = '';

    registerUsername: string = '';
    registerEmail: string = '';
    registerPassword: string = '';

    constructor(private inMemoryDataService: InMemoryDataService, private authService: AuthService, private router: Router, private messageService: MessageService) {
    }

    toggleForms(formType: string): void {
        this.isLoginForm = formType === 'login';
        this.isRegisterForm = formType === 'register';
    }

    onLogin(): void {
        if (this.authService.login(this.loginEmail, this.loginPassword)) {
            this.router.navigate(['user']);
            this.showSuccess('Sikeres bejelentkezés!');
        } else {
            this.showError('Sikertelen bejelentkezés!');
        }
    }

    onRegister(): void {
        const users = this.inMemoryDataService.getUsers();
        if (this.inMemoryDataService.getUsers().filter(user => user.username == this.registerUsername).length > 0) {
            this.showError('Felhasználónév már létezik');
        } else {
            if (this.inMemoryDataService.getUsers().filter(user => user.email == this.registerEmail).length > 0) {
                this.showError('Email már létezik');
            } else {
                const newUser: User = {
                    id: 0, // Az ID-t a szolgáltatás generálja
                    username: this.registerUsername,
                    email: this.registerEmail,
                    password: this.registerPassword,
                    fav: []
                };
                this.inMemoryDataService.addUser(newUser);
                this.isLoginForm = true;
                this.isRegisterForm = false;
                this.showSuccess('Sikeres regisztráció!');
            }
        }
    }

    showSuccess(msg: string) {
        this.messageService.add({severity: 'success', summary: 'Success', detail: msg});
    }

    showError(msg: string) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: msg});
    }
}




