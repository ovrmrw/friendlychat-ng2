import { Hero } from '../types';


export class EditHero {
  constructor(public hero: Hero) { }
}

export class AddHero {
  constructor(public hero: Hero) { }
}

export class DeleteHero {
  constructor(public id: number) { }
}

export type Action = EditHero | AddHero | DeleteHero;