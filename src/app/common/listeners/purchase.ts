import {Injectable, Output, EventEmitter} from '@angular/core';
import {IPurchase} from '../interfaces/purchase';

@Injectable()
export class PurchaseListener {
  @Output() bought: EventEmitter<IPurchase> = new EventEmitter();
}