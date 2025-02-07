import * as blessed from 'blessed';

import { Button } from '../ui/button';
import { term } from '../ui/term';
import { TerminalApp } from '../app';
import { TapeStore, TapeStoreBag } from './store';
import { Display } from '../ui/display';

// change to class, maybe?
export const TapeContainer = (app: TerminalApp) => {
  const { dispatcher } = app;

  const store: TapeStore = dispatcher.storeByName('TapeStore');
  // tape
  // const display = new Display(store.state.command);

  const logger = blessed.log({
    top: 'center',
    left: 'center',
    width: '100%',
    height: '100%',
    border: 'line',
    padding: {
      left: 1,
      right: 1,
    },
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    scrollback: 100,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'yellow',
      },
      style: {
        inverse: true,
      },
    },
    style: {
      bg: '#001100',
      fg: '#ff9000',
    },
  });

  const watch = (updatedState: TapeStoreBag) => {
    // console.log(`TAPE STORE UPDATED:`);
    // console.log(updatedState);
    logger.log(updatedState.logs.at(-1) || '');
  };
  store.subscribe(watch);

  const render = () => {
    let layout = blessed.layout({
      layout: 'grid',
      top: 1,
      left: '50%',
      width: 25,
      height: 17,
    });

    layout.append(logger);

    term.append(layout);
    term.render();
  };

  return { watch, render };
};
