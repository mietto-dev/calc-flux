import * as blessed from 'blessed';

// Create a screen object.
let term = blessed.screen({
  smartCSR: true,
});

term.title = 'Ifless Calculator';

export { term };
