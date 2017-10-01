import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {IGame, GAME_AVAILABILITY} from '../interfaces/game';
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

  constructor() {
    this.games = [{
      name: 'Divine Divinity',
      price: 5.99,
      languages: 4,
      goodies: 6,
      availability: GAME_AVAILABILITY.ALWAYS,
      images: {
        active: '/assets/images/game-1-active.png',
        inactive: '/assets/images/game-1-inactive.png'
      }
    }, {
      name: 'Beyond Divinity',
      price: 5.99,
      languages: 4,
      goodies: 6,
      availability: GAME_AVAILABILITY.AVERAGE,
      images: {
        active: '/assets/images/game-2-active.png',
        inactive: '/assets/images/game-2-inactive.png'
      }
    }, {
      name: 'Divinity 2',
      price: 19.99,
      languages: 7,
      goodies: 9,
      availability: GAME_AVAILABILITY.TOP,
      images: {
        active: '/assets/images/game-3-active.png',
        inactive: '/assets/images/game-3-inactive.png'
      }
    }];

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
    let purchases = _.sortBy(window.localStorage.getItem('purchases') ? JSON.parse(window.localStorage.getItem('purchases')) : []).reverse();

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
    let purchases = window.localStorage.getItem('purchases') ? JSON.parse(window.localStorage.getItem('purchases')) : [];
    
    purchases.push(parseInt(this.properSliderValue));

    window.localStorage.setItem('purchases', JSON.stringify(purchases));
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