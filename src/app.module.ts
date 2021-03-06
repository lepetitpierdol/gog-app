import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

// Components
import {AppComponent} from './app/app';
import {HeaderComponent} from './app/header/header';
import {PayComponent} from './app/pay/pay';
import {GoodiesComponent} from './app/goodies/goodies';

// Services
import {StorageService} from './app/common/services/storage';

// Listeners
import {PurchaseListener} from './app/common/listeners/purchase';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PayComponent,
    GoodiesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    StorageService,
    PurchaseListener
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
