import $ from 'jquery';
import EventEmitter from 'eventemitter2';

export default class {
  constructor(parentEl, widthInModelUnits = 10, heightInModelUnits = null) {
    this.widthInModelUnits = widthInModelUnits;
    this.heightInModelUnits = heightInModelUnits;
    this.$canvas = $('<canvas>');
    this.$canvas.appendTo(parentEl);
    this.ctx = this.$canvas[0].getContext('2d');

    this.dispatch = new EventEmitter();

    this.resize();
  }

  resize() {
    this.width = this.$canvas.parent().width() * window.devicePixelRatio;
    this.height = this.$canvas.parent().height() * window.devicePixelRatio;
    this.$canvas.attr({
      width: this.width,
      height: this.height
    });
    this.$canvas.css({
      width: this.width / window.devicePixelRatio,
      height: this.height / window.devicePixelRatio
    });
  }

  get scaleFactor() {
    if (this.widthInModelUnits) {
      return this.width / this.widthInModelUnits;
    } else {
      return this.height / this.heightInModelUnits;
    }
  }

  // Convert value from model unit to view unit (pixels).
  s(val) {
    return val * this.scaleFactor;
  }

  // Convert value from view unit (pixels) to model unit.
  sInv(val) {
    return val / this.scaleFactor;
  }

  // Convert X coordinate from model unit to view unit (pixels).
  sx(x) {
    return x * this.scaleFactor + this.width * 0.5;
  }

  // Convert X coordinate from view unit (pixels) to model unit.
  sxInv(x) {
    return (x - this.width * 0.5) / this.scaleFactor;
  }

  // Convert Y coordinate from model unit to view unit (pixels).
  sy(y) {
    return this.height - (y * this.scaleFactor + this.height * 0.5);
  }

  // Convert Y coordinate from view unit (pixels) to model unit.
  syInv(y) {
    return (this.height - y - this.height * 0.5) / this.scaleFactor;
  }

  // Convenience function that takes an object and applies #sx to p.x and #sy to p.y.
  p(p) {
    p.x = this.sxInv(p.x);
    p.y = this.syInv(p.y);
    return p;
  }

  // Convenience function that takes an object and applies #sxInv to p.x and #syInv to p.y.
  pInv(p) {
    p.x = this.sxInv(p.x);
    p.y = this.syInv(p.y);
    return p;
  }

  setCursor(v) {
    this.$canvas.css('cursor', v);
  }

  // Delegate #on to EventEmitter object.
  on() {
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  // Overwrite in subclass!
  render() {
  }
}