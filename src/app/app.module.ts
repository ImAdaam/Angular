import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table'; // TableModule importálása a PrimeNG-ből
import { ScrollerModule } from 'primeng/scroller'; // ScrollerModule importálása a PrimeNG-ből
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Animáció modul importálása
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReceptekListaComponent } from './receptek-lista/receptek-lista.component';
import { InMemoryDataService } from './in-memory-data.service';
//import { ReceptService } from './recept.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AuthComponent } from './auth/auth.component';
import { provideRouter } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ReceptekListaComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    CardModule,
    TableModule,
    ScrollerModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    FormsModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
