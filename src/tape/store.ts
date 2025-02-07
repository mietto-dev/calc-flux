import { Action } from '../../lib/action';
import { Dispatcher } from '../../lib/dispatcher';
import { HandlersGate, Store } from '../../lib/store';

export type TapeStoreBag = {
  logs: string[];
};

export class TapeStore extends Store<TapeStoreBag> {
  constructor(dispatcher: Dispatcher) {
    super({ logs: [] }, dispatcher);
    this.name = 'TapeStore';
  }
  handlers: HandlersGate = {
    COMMAND_EXEC: (payload) => {
      if (payload.length > 0) {
        const { logs } = this.state;
        logs.push(payload);
        this.update({ ...this._state, logs });
      }
    },
  };
}
