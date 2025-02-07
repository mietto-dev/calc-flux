import { Action } from '../../lib/action';
import { Command } from '../../lib/command';
import { Dispatcher } from '../../lib/dispatcher';
import { HandlersGate, Store } from '../../lib/store';

export type CalculatorStoreBag = {
  command: Command;
};

export class CalculatorStore extends Store<CalculatorStoreBag> {
  constructor(dispatcher: Dispatcher) {
    super(
      {
        command: new Command(),
      },
      dispatcher,
    );
    this.name = 'CalculatorStore';
  }

  handlers: HandlersGate = {
    NUMBER_BTN: (payload) => {
      let { command } = this.state;
      command.input(payload);
      this.update({ ...this.state, command });
    },
    DOT_BTN: () => {
      let { command } = this.state;
      command.dot();
      this.update({ ...this.state, command });
    },
    CLEAR_BTN: () => {
      let command = new Command();
      this.update({ ...this.state, command });
    },
    BACKSPACE_BTN: () => {
      let { command } = this.state;
      command.erase();
      this.update({ ...this.state, command });
    },
    OPERATOR_BTN: (payload) => {
      let { command } = this.state;
      command.operator = payload;
      // TODO: LOGIC for when user presses 1 + 2 + 3 ... in that case, the second + operator acts as =
      command.push();
      this.update({ ...this.state, command });
    },
    RESULT_BTN: () => {
      let { command } = this.state;
      command.push();
      let result = command.execute();

      this.dispatcher.dispatch({
        type: 'COMMAND_EXEC',
        payload: command.print(),
      });

      let cmd = new Command(result);
      this.update({ ...this.state, command: cmd });
    },
  };
}
