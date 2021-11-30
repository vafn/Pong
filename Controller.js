export class Controller {
  constructor() {
    this.keys = ',';
  }
  setup(element) {
    element.onkeydown = (event) => this.keyDown(event);
    element.onkeyup = (event) => this.keyUp(event);
    element.onblur = (event) => this.blur(event);
  }

  keyDown(event) {
    if (event.key !== 'F5' && event.key !== 'F12')
      event.preventDefault();
    if (this.keys.indexOf(',' + event.key + ',') < 0)
      this.keys += event.key + ',';
  }
  keyUp(event) {
    this.keys = this.keys.replaceAll(event.key + ',', '');
  }
  blur(event) {
    this.keys = ','
  }
  isPressed(key) {
    return this.keys.indexOf(',' + key + ',') >= 0;
  }
}
