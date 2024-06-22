import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table'; // TableModule importálása a PrimeNG-ből
import { ScrollerModule } from 'primeng/scroller'; // ScrollerModule importálása a PrimeNG-ből
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Animáció modul importálása
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { ReceptService } from './recept.service';
import { AuthGuard } from './auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';


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
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    CheckboxModule,
    MultiSelectModule,
    DropdownModule,
    InputTextareaModule,
    ToastModule,
    InputTextModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
