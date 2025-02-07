import { Action } from './action';
import { Store } from './store';
import { EventEmitter } from 'events';

interface ISubscriber {
  subscribe(event: string, handler: (payload: any) => any | Promise<any>): this;
}

class Herald implements ISubscriber {
  constructor(private readonly emitter: EventEmitter) {}
  subscribe(event: string, handler: (payload: any) => any): this {
    this.emitter.on(event, handler);
    return this;
  }

  publish(event: string, payload: any): this {
    this.emitter.emit(event, payload);
    return this;
  }
}

export class Dispatcher {
  _stores: Store[] = [];
  _emitter = new EventEmitter();
  _herald = new Herald(this._emitter);

  get stores() {
    return this._stores;
  }

  storeByName(name: string): Store {
    let st = this._stores.find((el) => el.name === name);
    if (!st) {
      throw new Error(`Store not found: ${name}`);
    }
    return st;
  }

  register(store: Store) {
    for (let key in store.handlers) {
      this.subscribe(key, store.handlers[key]);
    }
    this._stores.push(store);
  }

  subscribe(event: string, handler: (payload?: any) => any) {
    this._herald.subscribe(event, handler);
  }

  dispatch({ type, payload }: Action) {
    this._herald.publish(type, payload);
  }

  broadcast({ payload }: Action) {
    this._stores.forEach((store) =>
      store.onEvent({ type: 'BROADCAST', payload }),
    );
  }
}

// Action Creators Example:
// pressNumber(key: string) => dispatcher.dispatch({type: "NUMBER_PRESS", payload: "5"})
