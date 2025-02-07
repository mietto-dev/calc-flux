import { Dispatcher } from '../../lib/dispatcher';

export const CalculatorActions = (dispatcher: Dispatcher) => {
  const numberPressed = (ch: string) => {
    dispatcher.dispatch({ type: 'NUMBER_BTN', payload: ch });
  };

  const clearPressed = () => {
    dispatcher.dispatch({ type: 'CLEAR_BTN' });
  };

  const backspacePressed = () => {
    dispatcher.dispatch({ type: 'BACKSPACE_BTN' });
  };

  const dotPressed = (ch: string) => {
    dispatcher.dispatch({ type: 'DOT_BTN' });
  };

  const operatorPressed = (ch: string) => {
    dispatcher.dispatch({ type: 'OPERATOR_BTN', payload: ch });
  };

  const resultPressed = () => {
    dispatcher.dispatch({ type: 'RESULT_BTN' });
  };

  return {
    numberPressed,
    dotPressed,
    operatorPressed,
    resultPressed,
    clearPressed,
    backspacePressed,
  };
};
