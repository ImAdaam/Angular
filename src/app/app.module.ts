import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table'; // TableModule importálása a PrimeNG-ből
import {ScrollerModule} from 'primeng/scroller'; // ScrollerModule importálása a PrimeNG-ből
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'; // Animáció modul importálása
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {FormsModule} from '@angular/forms';
import {ReceptService} from './recept.service';
import {ReactiveFormsModule} from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {AuthGuard} from './auth.guard';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ReceptekListaComponent} from './receptek-lista/receptek-lista.component';
import {InMemoryDataService} from './in-memory-data.service';
//import { ReceptService } from './recept.service';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {AuthComponent} from './auth/auth.component';
import {provideRouter} from '@angular/router';
import {UserReceptekComponent} from './user-receptek/user-receptek.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {PaginatorModule} from 'primeng/paginator';
import {ReceptCreateComponent} from './recept-create/recept-create.component';
import {ReceptUpdateComponent} from './recept-update/recept-update.component';
import {AuthInterceptor} from './auth.interceptor';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

import {ToastModule} from 'primeng/toast';

@NgModule({
    declarations: [
        AppComponent,
        ReceptekListaComponent,
        AuthComponent,
        UserReceptekComponent,
        ReceptCreateComponent,
        ReceptUpdateComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        MatTableModule,
        PaginatorModule,
        CardModule,
        HttpClientModule,
        TableModule,
        ScrollerModule,
        DividerModule,
        ButtonModule,
        MultiSelectModule,
        DropdownModule,
        BrowserAnimationsModule,
        ProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
        AppRoutingModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [
        AuthGuard,
        ConfirmationService,
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
