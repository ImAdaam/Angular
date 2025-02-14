import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptekListaComponent } from './receptek-lista/receptek-lista.component';
import { AuthComponent } from './auth/auth.component';
import { UserReceptekComponent } from './user-receptek/user-receptek.component';
import { ReceptCreateComponent } from './recept-create/recept-create.component'
import { ReceptUpdateComponent } from './recept-update/recept-update.component';
import { AuthGuard } from './auth.guard';

import { Route } from "@angular/router";

const routes: Routes = [
  { path: '', component: ReceptekListaComponent},
  { path: 'auth', component: AuthComponent },
  { path: 'user', component:  UserReceptekComponent, canActivate: [AuthGuard]},
  { path: 'create', component:  ReceptCreateComponent, canActivate: [AuthGuard]},
  { path: 'update/:id', component:  ReceptUpdateComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
