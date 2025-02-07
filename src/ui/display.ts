import * as blessed from 'blessed';
import { term } from './term';
import { Command } from '../../lib/command';
import { SupportedOperations } from '../../lib/supported';

const opts: blessed.Widgets.BoxOptions = {
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
  content: '',
};

export class Display {
  public widget: blessed.Widgets.BoxElement;
  public opts: blessed.Widgets.BoxOptions = opts;

  // kind of an anti-pattern mixing up UI behavior with business / arch definitions
  constructor(private command: Command) {
    this.opts = { ...this.opts, content: command.read().value.join('') };
    this.widget = blessed.box(this.opts);
  }

  update(cmd: Command) {
    this.command = cmd;
    this.refresh();
  }

  flicker() {
    this.widget.content = '';
    term.render();
    setTimeout(() => {
      this.refresh();
    }, 100);
  }

  refresh() {
    this.widget.children = [];
    const { operator, value } = this.command.read();
    this.widget.content = value.join('');
    if (operator !== SupportedOperations.NOOP) {
      this.widget.prepend(
        blessed.text({
          align: 'left',
          content: operator,
          style: {
            bg: '#001100',
            fg: 'white',
          },
        }),
      );
    }
    term.render();
  }
}
