import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ImprintComponent } from './imprint/imprint.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    NavbarComponent,
    ImprintComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'grid', component: GridComponent},
      {path: 'imprint', component: ImprintComponent},
      {path: '', redirectTo: '/grid', pathMatch: 'full'},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
