import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptekListaComponent } from './receptek-lista/receptek-lista.component';
import { AuthComponent } from './auth/auth.component';
import { Route } from "@angular/router";

const routes: Routes = [
  { path: '', component: ReceptekListaComponent },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
