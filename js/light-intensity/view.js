import $ from 'jquery';
import EventEmitter from 'eventemitter2';

const MOVE_CURSOR = 'move';
const HEIGHT = 10;

export default class {
  constructor(parentEl) {
    this.$canvas = $('<canvas>');
    this.$canvas.appendTo(parentEl);
    this.ctx = this.$canvas[0].getContext('2d');

    this.dispatch = new EventEmitter();

    this.resize();
    this.setupInteraction();
  }

  setProps(props) {

  }

  resize() {
    this.width = this.$canvas.parent().width();
    this.height = this.$canvas.parent().height();
    this.$canvas.attr({
      width: this.width,
      height: this.height
    });
    this.$canvas.css({
      width: this.width,
      height: this.height
    });
    this.scaleFactor = this.height / HEIGHT;
  }

  s(val) {
    return val * this.scaleFactor;
  }

  sInv(val) {
    return val / this.scaleFactor;
  }

  sx(x) {
    return x * this.scaleFactor + this.width * 0.5;
  }

  sxInv(x) {
    return (x - this.width * 0.5) / this.scaleFactor;
  }

  sy(y) {
    return y * this.scaleFactor + this.height * 0.5;
  }

  syInv(y) {
    return (y - this.height * 0.5) / this.scaleFactor;
  }

  // Delegate #on to EventEmitter object.
  on() {
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  render(star, planet) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.renderCircle(star, '#ffff00', '#aaaa00');
    this.renderCircle(planet, '#004A82', '#0076D0');
  }
  
  renderCircle(data, fillColor, strokeColor) {
    this.ctx.beginPath();
    this.ctx.arc(this.sx(data.x), this.sy(data.y), this.s(data.diameter * 0.5), 0, 2 * Math.PI, false);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.lineWidth = this.s(data.diameter * 0.01);
    this.ctx.strokeStyle = strokeColor;
    this.ctx.stroke();
  }

  setupInteraction() {
    let $canvas = this.$canvas;
    let mousemove = function (evt) {
      let coords = mousePos(evt, $canvas);
      this.dispatch.emit('planet.change', {x: this.sxInv(coords.x), y: this.syInv(coords.y)});
    }.bind(this);
    $canvas.on('mousedown', () => {
      $canvas.on('mousemove', mousemove);
    });
    $canvas.on('mouseup', () => {
      $canvas.off('mousemove', mousemove);
    });
  }
}

// Mouse position in pixels.
function mousePos(event, targetElement) {
  let $targetElement = $(targetElement);
  let parentX = $targetElement.offset().left;
  let parentY = $targetElement.offset().top;
  return {x: event.pageX - parentX, y: event.pageY - parentY};
}
