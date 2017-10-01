import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

// Components
import {AppComponent} from './app/app';
import {HeaderComponent} from './app/header/header';
import {PayComponent} from './app/pay/pay';

// Services

// Pipes

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
