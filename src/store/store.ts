import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import lodash from 'lodash';

import { Hero } from '../types';
import { Action, EditHero, AddHero, DeleteHero } from './actions';
import { logger } from '../helper';

interface AppState {
  heroes: Hero[];
}


@Injectable()
export class Dispatcher<T> extends Subject<T> { }


@Injectable()
export class Store {
  private stateSubject$: Subject<AppState>;

  constructor(
    dispatcher$: Dispatcher<Action>
  ) {
    const initState: AppState = {
      heroes: initialHeroes
    };
    this.stateSubject$ = new BehaviorSubject(initState);

    Observable
      .zip<AppState>(
      heroReducer(initState.heroes, dispatcher$),
      (heroes) => {
        return { heroes } as AppState;
      }
      )
      .subscribe(appState => {
        this.stateSubject$.next(appState);
      });
  }


  private get returner$() { return this.stateSubject$.asObservable().map(state => lodash.cloneDeep(state)); }

  get state$() { return this.returner$; }
  get heroes$() { return this.returner$.map(state => state.heroes); }
}


function heroReducer(initHeroes: Hero[], dispatcher$: Observable<Action>): Observable<Hero[]> {
  return dispatcher$
    .scan<Hero[]>((heroes: Hero[], action: Action) => {
      const oldHeroes = heroes;
      if (action instanceof EditHero) {
        const editedHero = action.hero;
        heroes = lodash.uniqBy([editedHero, ...heroes], 'id');
      } else if (action instanceof AddHero) {
        const newHero = action.hero;
        heroes = lodash.uniqBy([newHero, ...heroes], 'id');
      } else if (action instanceof DeleteHero) {
        const deleteId = action.id;
        heroes = lodash.reject(heroes, { id: deleteId });
      }
      logger('Store - heroReducer', oldHeroes, heroes);
      return lodash.orderBy(heroes, ['id'], ['asc']);
    }, initHeroes);
}


const initialHeroes: Hero[] = [
  { id: 11, name: 'Mr. Nice' },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' }
];