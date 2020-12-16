import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ImprintComponent } from './imprint/imprint.component';
import { GroupsComponent } from './groups/groups.component';
import { CategoriesComponent } from './categories/categories.component';
import {FormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    NavbarComponent,
    ImprintComponent,
    GroupsComponent,
    CategoriesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'grid', component: GridComponent},
      {path: 'imprint', component: ImprintComponent},
      {path: 'groups', component: GroupsComponent},
      {path: 'categories', component: CategoriesComponent},
      {path: 'login', component: LoginComponent},
      {path: '', redirectTo: '/login', pathMatch: 'full'},
    ]),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
