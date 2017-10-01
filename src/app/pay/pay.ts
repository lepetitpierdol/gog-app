import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {IGame, GAME_AVAILABILITY} from '../common/interfaces/game';
import {StorageService} from '../common/services/storage';
import {PurchaseListener} from '../common/listeners/purchase';
import {Games} from './games';
import * as _ from 'lodash';

@Component({
  selector: 'pay-for-games',
  template: require('./pay.html')
})
export class PayComponent implements OnInit {
  private games: Array<IGame>;
  private goals: Array<string>;

  private sliderMin: number = 0.99;
  private sliderMax: number = 49.99;
  private sliderStep: number = 0.1;
  
  private sliderValue: string;
  private properSliderValue: string;
  private sliderHandlePositionPercent: number = 0;
  private sliderHandlePositionPX: number = 95;

  @ViewChild('rangeInput') rangeInput: ElementRef;
  @ViewChild('goalsEl') goalsElement: ElementRef;

  constructor(private purchaseListener: PurchaseListener, private storageService: StorageService) {
    this.games = Games;
    this.createGoals();
  }

  ngOnInit() {
    this.sliderMoveAction(this.goals[1]);
  }

  private sliderMoveAction(presetValue?: string): void {
    let value = presetValue || this.rangeInput.nativeElement.value;

    if (value < this.sliderMin) {
      this.sliderValue = this.properSliderValue = this.sliderMin.toString();
    } else if (value > this.sliderMax) {
      this.properSliderValue = value;
      this.sliderValue = this.sliderMax.toString();
    } else {
      this.sliderValue = this.properSliderValue = value;
    }

    this.sliderHandlePositionPercent = ((parseFloat(this.sliderValue) - this.sliderMin) / this.sliderMax) * 100;
    this.sliderHandlePositionPX = this.rangeInput.nativeElement.offsetWidth + (this.rangeInput.nativeElement.offsetWidth * ((parseFloat(this.sliderValue) - this.sliderMax) / (this.sliderMax - this.sliderMin)));

    if ((this.rangeInput.nativeElement.offsetWidth - 110) < this.sliderHandlePositionPX) {
      this.sliderHandlePositionPX = this.rangeInput.nativeElement.offsetWidth - 110;
    } else if (95 > this.sliderHandlePositionPX) {
      this.sliderHandlePositionPX = 95;
    }
  }

  private getGoalPX(value: number, index: number): number {
    let result = this.rangeInput.nativeElement.offsetWidth + (this.rangeInput.nativeElement.offsetWidth * ((value - this.sliderMax) / (this.sliderMax - this.sliderMin)));

    if (result > this.rangeInput.nativeElement.offsetWidth) {
      result = this.rangeInput.nativeElement.offsetWidth;
    }

    let goalElements = this.goalsElement.nativeElement.querySelectorAll('div.goal');
    
    if (parseFloat(goalElements[1].style.left) <= (parseFloat(goalElements[0].style.left) + goalElements[0].offsetWidth)) {
      goalElements[0].querySelector('span').style.left = -(goalElements[0].offsetWidth / 2) + 'px'
      goalElements[1].querySelector('span').style.left = (goalElements[1].offsetWidth / 2) + 'px';
    }

    if (result >= this.rangeInput.nativeElement.offsetWidth) {
      result = this.rangeInput.nativeElement.offsetWidth - 20;
    }

    return result;
  }

  private createGoals(): void {
    let purchases = _.sortBy(this.storageService.get('purchases') || []).reverse();

    if (!purchases.length) {
      this.goals = [(this.sliderMin * 3).toFixed(2), (this.sliderMin * 10).toFixed(2)];
      return;
    }

    let total = _.sum(purchases);
    let topTotal = 0;
    let topAverageCount = Math.ceil(0.1 * purchases.length);

    for (let i = 0; i < topAverageCount; i++) {
      topTotal += purchases[i];
    }

    this.goals = [(total / purchases.length).toFixed(2), (topTotal / topAverageCount).toFixed(2)];
    let sliderMax = Math.ceil(parseFloat(this.goals[1]));

    if (sliderMax > this.sliderMax) {
      this.sliderMax = sliderMax;
    }
  }

  private manuallyChangeSliderValue($event: Event): void {
    this.sliderMoveAction($event.target['value']);
  }

  private payAction(): void {
    let purchases = this.storageService.get('purchases') || [];
    let gamesBought = this.storageService.get('gamesBought') || '0';

    purchases.push(parseInt(this.properSliderValue));

    let itemsBought = 0;
    for (let game of this.games) {
      if (this.isGameAvailable(game)) {
        itemsBought++;
      }
    }

    this.purchaseListener.bought.emit({
      amount: parseInt(this.properSliderValue),
      itemsBought: itemsBought
    });

    this.storageService.set('purchases', purchases);
    this.storageService.set('gamesBought', parseInt(gamesBought) + itemsBought);
    this.createGoals();
  }

  private isGameAvailable(game: IGame): boolean {
    if (game.availability === GAME_AVAILABILITY.ALWAYS) {
      return true;
    }

    if (
      game.availability === GAME_AVAILABILITY.AVERAGE &&
      parseFloat(this.properSliderValue) > parseFloat(this.goals[0])
    ) {
      return true;
    }

    if (
      game.availability === GAME_AVAILABILITY.TOP &&
      parseFloat(this.properSliderValue) >= parseFloat(this.goals[1])
    ) {
      return true;
    }
    
    return false;
  }
}