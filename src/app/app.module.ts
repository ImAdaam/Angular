import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table'; // TableModule importálása a PrimeNG-ből
import { ScrollerModule } from 'primeng/scroller'; // ScrollerModule importálása a PrimeNG-ből
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Animáció modul importálása
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { ReceptService } from './recept.service';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReceptekListaComponent } from './receptek-lista/receptek-lista.component';
import { InMemoryDataService } from './in-memory-data.service';
//import { ReceptService } from './recept.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AuthComponent } from './auth/auth.component';
import { provideRouter } from '@angular/router';
import { UserReceptekComponent } from './user-receptek/user-receptek.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { PaginatorModule } from 'primeng/paginator';
import { ReceptCreateComponent } from './recept-create/recept-create.component';

@NgModule({
  declarations: [
    AppComponent,
    ReceptekListaComponent,
    AuthComponent,
    UserReceptekComponent,
    ReceptCreateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    PaginatorModule,
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
