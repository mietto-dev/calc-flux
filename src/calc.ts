import * as blessed from 'blessed';

import { term } from './ui/term';
import { Button } from './ui/button';

// OPERAND LIMIT: 18 chars
let operand: string[] = ['0'];
let operandIndex = 0;
let operator = '';
const TOP_OFFSET = 6;

const flicker = () => {
  display.content = '';
  term.render();
  setTimeout(() => {
    updateDisplay();
  }, 100);
};

const numberPressed = (ch: string) => {
  // max length: 18
  if (operand.length > 17) {
    flicker();
    return;
  }

  // remove trailing zero
  if (operand.at(operandIndex) === '0') {
    operand.pop();
  }

  operand.push(ch);
  updateDisplay();
};

const dotPressed = (ch: string) => {
  if (operand.includes('.')) {
    flicker();
    return;
  }

  operand.push('.');
  operand.push('0');
  operandIndex = operand.length - 1;
  updateDisplay();
};

const plusPressed = (ch: string) => {
  // console.log(`DOT PRESSED`);
  operator = '+';
  updateDisplay();
};

const minusPressed = (ch: string) => {
  // console.log(`DOT PRESSED`);
};

const equalsPressed = (ch: string) => {
  // console.log(`DOT PRESSED`);
};

const multPressed = (ch: string) => {
  // console.log(`DOT PRESSED`);
};

const divPressed = (ch: string) => {
  // console.log(`DOT PRESSED`);
};

const percentPressed = (ch: string) => {
  // console.log(`DOT PRESSED`);
};

const sqrtPressed = (ch: string) => {
  // console.log(`DOT PRESSED`);
};

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

const btnPlus = new Button('+', plusPressed);
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

const btnEq = new Button('=', equalsPressed);
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

const btnMinus = new Button('-', minusPressed);
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

const btnMult = new Button('x', multPressed);
btnMult.widget.height = 3;
lineLayout.top = 3 * 1 + TOP_OFFSET;
lineLayout.left = 4 * 4 + 1;
lineLayout.append(btnMult.widget);

const btnDiv = new Button('÷', divPressed);
btnDiv.widget.height = 3;
lineLayout.append(btnDiv.widget);

term.append(lineLayout);

// PERCENT and SQUARE ROOT
lineLayout = blessed.layout({
  layout: 'grid',
  width: 5,
  height: 1,
});

const btnPercent = new Button('%', percentPressed);
btnPercent.widget.height = 3;
lineLayout.top = TOP_OFFSET;
lineLayout.left = 4 * 4 + 1;
lineLayout.append(btnPercent.widget);

const btnSqrt = new Button('√', sqrtPressed);
btnSqrt.widget.height = 3;
lineLayout.append(btnSqrt.widget);

term.append(lineLayout);

const display = blessed.box({
  left: 2,
  top: 1,
  width: 25,
  height: 5,
  padding: {
    top: 1,
    bottom: 1,
    left: 1,
    right: 2,
  },
  align: 'right',
  style: {
    bg: '#001100',
    fg: '#ff9000',
  },
  border: 'line',
  content: operand.join(''),
});

term.prepend(display);

const updateDisplay = () => {
  display.content = operand.join('');
  if (operator.length > 0) {
    display.prepend(
      blessed.text({
        align: 'left',
        content: '+',
        style: {
          bg: '#001100',
          fg: 'white',
        },
      }),
    );
  }
  term.render();
};

const resetDisplay = () => {
  operand = ['0'];
  operator = '';
  operandIndex = 0;
  display.children = [];
  updateDisplay();
};

// Clear
term.key(['escape'], function (ch: any, key: any) {
  resetDisplay();
  flicker();
});

// Quit on Escape, q, or Control-C.
term.key(['C-c'], function (ch: any, key: any) {
  return process.exit(0);
});

// Render the screen.
term.render();
