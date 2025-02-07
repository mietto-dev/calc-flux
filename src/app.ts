import { Dispatcher } from '../lib/dispatcher';

import { CalculatorStore } from './calculator/store';
import { TapeStore } from './tape/store';
import { TapeContainer } from './tape/view';
import { CalculatorContainer } from './calculator/view';

export class TerminalApp {
  dispatcher = new Dispatcher();
  view: { watch: (state: any) => void; render: () => void };
  view2: { watch: (state: any) => void; render: () => void };

  constructor() {
    this.dispatcher.register(new CalculatorStore(this.dispatcher));
    this.dispatcher.register(new TapeStore(this.dispatcher));
    this.view = CalculatorContainer(this);
    this.view2 = TapeContainer(this);
  }

  start() {
    this.view.render();
    this.view2.render();
  }
}

const app = new TerminalApp();

export default app;
