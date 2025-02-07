import * as blessed from 'blessed';
import { term } from './term';

const opts: blessed.Widgets.ButtonOptions = {
  shrink: true,
  mouse: true,
  border: { type: 'line' },
  style: {
    fg: 'red',
  },
  //height: 3,
  // right: 4,
  //bottom: 6,
  // bottom: 2,
  padding: 0,
};

export class Button {
  public widget: blessed.Widgets.ButtonElement;
  public opts: blessed.Widgets.ButtonOptions = opts;
  constructor(
    public key: string,
    public onClicked: (ch: string) => void,
    alternativeKeys?: string[],
  ) {
    this.opts = { ...this.opts, content: ` ${key} ` };
    this.widget = blessed.button(this.opts);

    // mouse and keyboard handlers
    // this.widget.on('press', () => {
    //   this.pressed(key);
    // });

    term.key(`${key}`, (ch: any, k) => {
      this.pressed(key);
    });

    if (alternativeKeys && alternativeKeys.length > 0) {
      for (let alt of alternativeKeys) {
        term.key(`${alt}`, (ch: any, k) => {
          this.pressed(key);
        });
      }
    }
  }

  pressed(ch: string) {
    this.widget.style = { ...this.widget.style, bg: 'blue' };
    term.render();

    setTimeout(() => {
      this.widget.style = { ...this.widget.style, fg: 'red', bg: '' };
      term.render();
    }, 150);

    this.onClicked(ch);
  }
}
