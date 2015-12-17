import $ from 'jquery';
import CanvasView from '../common/canvas-view.js';
import {distObj, mousePosHD} from '../common/utils.js';

const MOVE_CURSOR = 'move';
const DEFAULT_CURSOR = 'default';
const MODEL_HEIGHT = 10;

export default class extends CanvasView {
  constructor(parentEl) {
    super(parentEl, null, MODEL_HEIGHT);
    this.setupInteraction();
  }

  render(star, planet) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.renderCircle(star, '#ffff00', '#aaaa00', 'star');
    this.renderCircle(planet, '#004A82', '#0076D0', 'planet');

    this.star = star;
    this.planet = planet;
  }

  renderCircle(data, fillColor, strokeColor, title) {
    this.ctx.beginPath();
    this.ctx.arc(this.sx(data.x), this.sy(data.y), this.s(data.diameter * 0.5), 0, 2 * Math.PI, false);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.lineWidth = this.s(data.diameter * 0.01);
    this.ctx.strokeStyle = strokeColor;
    this.ctx.stroke();
    this.ctx.font = this.s(0.5) + "px Arial";
    this.ctx.fillText(title, this.sx(data.x + 0.52 * data.diameter), this.sy(data.y - 0.45 * data.diameter));
  }

  setupInteraction() {
    let $canvas = this.$canvas;
    let dragging = false;
    let offset = {};
    $canvas.on('mousemove touchmove', (evt) => {
      let p = mousePosHD(evt, $canvas);
      this.pInv(p);
      let d = distObj(p, this.planet);
      this.setCursor(dragging || d < interactionRadius(this.planet) ? MOVE_CURSOR : DEFAULT_CURSOR);
      if (dragging) {
        this.dispatch.emit('planet.change', {x: p.x + offset.x, y: p.y + offset.y});
      }
    });
    $canvas.on('mousedown touchstart', (evt) => {
      let p = mousePosHD(evt, $canvas);
      this.pInv(p);
      let d = distObj(p, this.planet);
      if (d < interactionRadius(this.planet)) {
        offset.x = this.planet.x - p.x;
        offset.y = this.planet.y - p.y;
        dragging = true;
      }
    });
    $canvas.on('mouseup touchend touchcancel', () => {
      dragging = false;
    });
  }
}

function interactionRadius(planet) {
  return Math.max(0.4, planet.diameter * 0.5);
}