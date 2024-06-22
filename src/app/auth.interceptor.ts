import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Megszerzi az auth tokent az AuthService-től
    const authToken = this.authService.getToken();

    // Klónozza a kérést, és hozzáadja az Authorization fejléchez az auth tokent
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    console.log('Intercepted HTTP request', authReq);

    // Továbbítja a módosított kérést
    return next.handle(authReq);
  }
}