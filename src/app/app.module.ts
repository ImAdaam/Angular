import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table'; // TableModule importálása a PrimeNG-ből
import { ScrollerModule } from 'primeng/scroller'; // ScrollerModule importálása a PrimeNG-ből
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Animáció modul importálása
import { ProgressSpinnerModule } from 'primeng/progressspinner';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReceptekListaComponent } from './receptek-lista/receptek-lista.component';
import { InMemoryDataService } from './in-memory-data.service';
//import { ReceptService } from './recept.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

@NgModule({
  declarations: [
    AppComponent,
    ReceptekListaComponent
  ],
  imports: [
    BrowserModule,
    CardModule,
    AppRoutingModule,
    TableModule,
    ScrollerModule,
    BrowserAnimationsModule,
    ProgressSpinnerModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
