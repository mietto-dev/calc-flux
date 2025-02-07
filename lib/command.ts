import { CalculatorOperations, SupportedOperations } from './supported';

/**
 * Approach: keep number and operator state on the calculator, only set Command fields when done typing (also command is kept on state).
 * Usage:
 * - Calc holds the current command on state, also holds display value on state (typed number) and operator, if existent.
 * - User presses number button:
 *      .Calc updates UI accordingly
 * - User presses operator button (+):
 *      . Calc invokes NumberInput action - currentCmd.push(num). Calc display value state is already updated.
 *      . Calc invokes OperatorInput action - currentCmd.operator("+")
 *      . Calc updates operator value
 *      . Calc re-renders
 * - User presses number button:
 *      . Calc clears display value
 * - User presses = button
 *      . Calc invokes NumberInput action - currentCmd.push(num).
 *      . Calc invokes Execute action - currentCmd.execute(). Calc operator value state should also be updated.
 *
 * Problems:
 *  - no single source of truth
 *  - Scattered logic to re-render
 *     Ex: when user types number, calc re-renders based on it's own "NumValue" state.
 *         Then, suppose user types "=" - command should be executed, returning a result.
 *         So we have to also keep track of the command result value and update the local Calc state.
 *
 * Better Approach: Keep all state inside the Command object. Delegate number building logic to Command. Track Command changes inside Calc via listeners.
 *
 * Calc:
 *  - button pressed?
 *  - ActionGate(key)
 *     . type = ActionTriggers[key] (NUMBER_PRESS, OPERATOR_PRESS, UI_PRESS)
 *     . action = { type, payload, state }
 *     . store.dispatch(action);
 *
 * Action: type, payload, state => state; where
 *   Type: NUMBER_PRESS, OPERATOR_PRESS, UI_PRESS
 *   State: command object
 *   Payload: key pressed
 *
 */
export class Command {
  private _operands: number[] = [];
  private _operator: SupportedOperations = SupportedOperations.NOOP;
  private _result = 0;
  private value: string[] = ['0'];

  private clearOnInput = false;

  constructor(initialValue?: number) {
    if (initialValue !== undefined) {
      this.value = initialValue.toString().split('');
      this.clearOnInput = true;
    }
  }

  read() {
    return {
      operator: this.operator,
      value: this.value,
    };
  }

  input(ch: string) {
    if (this.clearOnInput) {
      this.value = ['0'];
      this.clearOnInput = false;
    }

    // max length: 18
    if (this.value.length > 17) {
      return;
    }

    this.value.push(ch);
    if (this.value[0] === '0' && this.value[1] !== '.') {
      this.value.shift();
    }
  }

  dot() {
    if (this.clearOnInput) {
      this.value = ['0'];
      this.clearOnInput = false;
    }

    if (this.value.includes('.')) {
      return;
    }

    this.value.push('.');
  }

  erase() {
    if (this.clearOnInput) {
      this.value = ['0'];
      this.clearOnInput = false;
    }

    if (this.value.length === 1) {
      this.value = ['0'];
      return;
    }

    this.value.pop();
  }

  push() {
    const parsed = Number(this.value.join(''));
    this._operands.push(parsed);
    this.clearOnInput = true;
  }

  set operator(op: SupportedOperations) {
    this._operator = op;
  }

  get operator() {
    return this._operator;
  }

  execute() {
    const resolver = CalculatorOperations.get(this._operator) || this.fallback;
    this._result = resolver(this._operands);
    return this._result;
  }

  print() {
    return this.operator !== SupportedOperations.NOOP
      ? `${this._operands[0]} ${this._operator} ${this._operands[1]} = ${this._result}`
      : '';
  }

  fallback() {
    return this._operands.at(0) || 0;
  }
}
