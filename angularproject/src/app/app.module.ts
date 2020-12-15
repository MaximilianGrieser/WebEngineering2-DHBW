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

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    NavbarComponent,
    ImprintComponent,
    GroupsComponent,
    CategoriesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'grid', component: GridComponent},
      {path: 'imprint', component: ImprintComponent},
      {path: 'groups', component: GroupsComponent},
      {path: 'categories', component: CategoriesComponent},
      {path: '', redirectTo: '/grid', pathMatch: 'full'},
    ]),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
