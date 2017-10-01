export enum GAME_AVAILABILITY {
  ALWAYS,
  AVERAGE,
  TOP
}

export interface IGame {
  name: string;
  goodies: number;
  languages: number;
  price: number;
  availability: GAME_AVAILABILITY;
  images: {
    active: string;
    inactive: string;
  }
}