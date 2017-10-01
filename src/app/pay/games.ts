import {IGame, GAME_AVAILABILITY} from '../common/interfaces/game';

export var Games: Array<IGame> = [{
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