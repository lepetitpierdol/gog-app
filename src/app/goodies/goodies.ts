import {Component} from '@angular/core';
import {StorageService} from '../common/services/storage';
import {PurchaseListener} from '../common/listeners/purchase';
import {IPurchase} from '../common/interfaces/purchase';

@Component({
  selector: 'goodies',
  template: require('./goodies.html')
})
export class GoodiesComponent {
  private soldCopies: Array<string>;

  constructor(private purchaseListener: PurchaseListener, private storageService: StorageService) {
    this.soldCopies = parseInt(this.storageService.get('gamesBought') || '0').toString().split('').reverse();

    this.purchaseListener.bought.subscribe((purchase: IPurchase) => {
      this.soldCopies = (parseInt(this.soldCopies.reverse().join('')) + purchase.itemsBought).toString().split('').reverse();
    });
  }
}