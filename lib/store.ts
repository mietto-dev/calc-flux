import { Action } from './action';
import { Dispatcher } from './dispatcher';

export type HandlersGate = {
  [key: string]: (payload?: any) => any;
};

// turn into abstract class, so we can have CalcStore and LedgerStore
export abstract class Store<T = any> {
  protected _state: T;
  protected _subscribers: Array<Function> = [];

  name: string = '';
  handlers: HandlersGate = {};

  constructor(initialState: T, public dispatcher: Dispatcher) {
    this._state = initialState;
  }

  get state() {
    return this._state;
  }

  update(updated: T) {
    this._state = updated;
    this._subscribers.forEach((fn) => {
      fn(this.state);
    });
  }

  subscribe(callback: Function) {
    this._subscribers.push(callback);
  }

  onEvent({ type, payload }: Action) {
    const handler = this.handlers[type];
    !!handler && handler(payload);
  }
}
