import * as blessed from 'blessed';

import { Button } from '../ui/button';
import { term } from '../ui/term';
import { TerminalApp } from '../app';
import { CalculatorStore, CalculatorStoreBag } from './store';
import { CalculatorActions } from './actions';
import { SupportedOperations } from '../../lib/supported';
import { Display } from '../ui/display';

// change to class, maybe?
export const CalculatorContainer = (app: TerminalApp) => {
  const { dispatcher } = app;
  const {
    clearPressed,
    dotPressed,
    numberPressed,
    operatorPressed,
    backspacePressed,
    resultPressed,
  } = CalculatorActions(dispatcher);

  const store: CalculatorStore = dispatcher.storeByName('CalculatorStore');
  const display = new Display(store.state.command);

  const watch = (updatedState: CalculatorStoreBag) => {
    display.update(updatedState.command);
  };
  store.subscribe(watch);

  const render = () => {
    const TOP_OFFSET = 6;

    // NUMBERS LAYOUT
    let lineLayout = blessed.layout({
      layout: 'grid',
      width: 5,
      height: 1,
    });

    let row = 0;
    let col = 0;
    // 9 - 1
    for (let i = 9; i >= 1; i--) {
      const btn = new Button(i.toString(), numberPressed);
      lineLayout.prepend(btn.widget);

      // grid.set(row, col, 1, 1, blessed.button, btn.opts);
      if (col < 2) {
        col++;
      } else {
        lineLayout.top = row * 3 + TOP_OFFSET;
        lineLayout.left = 2;
        term.append(lineLayout);
        row++;
        col = 0;

        lineLayout = blessed.layout({
          layout: 'grid',
          width: 5,
          height: 1,
        });
      }
    }

    // DOT AND ZERO
    lineLayout.top = 3 * 3 + TOP_OFFSET;
    lineLayout.left = 2;

    const btnDot = new Button('.', dotPressed);
    lineLayout.prepend(btnDot.widget);

    const btn = new Button('0', numberPressed);
    btn.widget.width = 10;
    btn.widget.content = `   0   `;
    lineLayout.prepend(btn.widget);
    term.append(lineLayout);

    // PLUS
    lineLayout = blessed.layout({
      layout: 'grid',
      width: 5,
      height: 6,
    });

    const btnPlus = new Button('+', operatorPressed);
    btnPlus.widget.height = 6;
    btnPlus.widget.content = `\n\n + `;
    lineLayout.top = 3 * 2 + TOP_OFFSET;
    lineLayout.left = 4 * 4 + 1;
    lineLayout.append(btnPlus.widget);

    term.append(lineLayout);

    // EQUALS
    lineLayout = blessed.layout({
      layout: 'grid',
      width: 5,
      height: 1,
    });

    const btnEq = new Button('=', resultPressed, ['enter']);
    btnEq.widget.height = 3;
    lineLayout.top = 3 * 3 + TOP_OFFSET;
    lineLayout.left = 4 * 5 + 2;
    lineLayout.append(btnEq.widget);

    term.append(lineLayout);

    // MINUS
    lineLayout = blessed.layout({
      layout: 'grid',
      width: 5,
      height: 1,
    });

    const btnMinus = new Button('-', operatorPressed);
    btnMinus.widget.height = 3;
    lineLayout.top = 3 * 2 + TOP_OFFSET;
    lineLayout.left = 4 * 5 + 2;
    lineLayout.append(btnMinus.widget);

    term.append(lineLayout);

    // MULT and DIV
    lineLayout = blessed.layout({
      layout: 'grid',
      width: 5,
      height: 1,
    });

    const btnMult = new Button('x', operatorPressed, ['*']);
    btnMult.widget.height = 3;
    lineLayout.top = 3 * 1 + TOP_OFFSET;
    lineLayout.left = 4 * 4 + 1;
    lineLayout.append(btnMult.widget);

    const btnDiv = new Button('÷', operatorPressed, ['/']);
    btnDiv.widget.height = 3;
    lineLayout.append(btnDiv.widget);

    term.append(lineLayout);

    // PERCENT and SQUARE ROOT
    lineLayout = blessed.layout({
      layout: 'grid',
      width: 5,
      height: 1,
    });

    const btnPercent = new Button('%', operatorPressed);
    btnPercent.widget.height = 3;
    lineLayout.top = TOP_OFFSET;
    lineLayout.left = 4 * 4 + 1;
    lineLayout.append(btnPercent.widget);

    const btnSqrt = new Button('√', operatorPressed, ['s']);
    btnSqrt.widget.height = 3;
    lineLayout.append(btnSqrt.widget);

    term.append(lineLayout);

    term.prepend(display.widget);

    // Clear
    term.key('escape', function (ch: any, key: any) {
      clearPressed();
      // maybe this should be triggered by a NOOP_EVENT, so that Command could also directly trigger it.
      display.flicker();
    });

    term.key('backspace', function (ch: any, key: any) {
      backspacePressed();
      display.flicker();
    });

    // Quit q, or Control-C.
    term.key(['q', 'C-c'], function (ch: any, key: any) {
      return process.exit(0);
    });

    // Render the screen.
    term.render();
  };

  return { watch, render };
};
