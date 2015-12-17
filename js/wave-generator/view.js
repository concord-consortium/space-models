import CanvasView from '../common/canvas-view.js';

const STAR_COLOR = '#eeee33';
const TELESCOPE_W = 3;
const TELESCOPE_H = 4;

export default class extends CanvasView {
  constructor(parentEl, modelWidth) {
    super(parentEl, modelWidth);
    this.telescopeX = -modelWidth * 0.5;
  }

  render(star, wave) {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.renderWave(wave.x, wave.y, wave.starVx);
    this.renderCircle(star, STAR_COLOR, '#aaaa00');
    this.renderTelescope();
  }

  renderCircle(data, fillColor, strokeColor, title) {
    this.ctx.beginPath();
    this.ctx.arc(this.sx(data.x), this.sy(data.y), this.s(data.diameter * 0.5), 0, 2 * Math.PI, false);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.lineWidth = this.s(data.diameter * 0.01);
    this.ctx.strokeStyle = strokeColor;
    this.ctx.stroke();
  }

  renderWave(x, y, starVx) {
    let waveLen = x.length;
    this.ctx.lineWidth = this.s(0.15);
    this.ctx.beginPath();
    this.ctx.moveTo(this.sx(x[0]), this.sy(y[0]));
    this.ctx.strokeStyle = waveColor(starVx[0]);
    for (let i = 1; i < waveLen; i++) {
      this.ctx.lineTo(this.sx(x[i]), this.sy(y[i]));
      if (waveColor(starVx[i]) !== waveColor(starVx[i - 1])) {
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.sx(x[i]), this.sy(y[i]));
        this.ctx.strokeStyle = waveColor(starVx[i]);
      }
    }
    this.ctx.stroke();
  }

  renderTelescope() {
    let telGrad1 = this.ctx.createLinearGradient(0, this.sy(TELESCOPE_H * 0.4), 0, this.sy(-TELESCOPE_H * 0.4));
    telGrad1.addColorStop(0, '#333');
    telGrad1.addColorStop(0.2, '#eee');
    telGrad1.addColorStop(1, '#333');
    this.ctx.fillStyle = telGrad1;
    this.ctx.fillRect(this.sx(this.telescopeX), this.sy(TELESCOPE_H * 0.4), this.s(TELESCOPE_W * 0.5), this.s(TELESCOPE_H * 0.8));
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = this.s(0.05);
    this.ctx.strokeRect(this.sx(this.telescopeX), this.sy(TELESCOPE_H * 0.4), this.s(TELESCOPE_W * 0.5), this.s(TELESCOPE_H * 0.8));

    let telGrad2 = this.ctx.createLinearGradient(0, this.sy(TELESCOPE_H * 0.5), 0, this.sy(-TELESCOPE_H * 0.5));
    telGrad2.addColorStop(0, '#A59240');
    telGrad2.addColorStop(0.2, '#eee');
    telGrad2.addColorStop(1, '#947A19');
    this.ctx.fillStyle = telGrad2;
    this.ctx.fillRect(this.sx(this.telescopeX + TELESCOPE_W * 0.5), this.sy(TELESCOPE_H * 0.5), this.s(TELESCOPE_W * 0.5), this.s(TELESCOPE_H));
    this.ctx.strokeStyle = '#816813';
    this.ctx.lineWidth = this.s(0.05);
    this.ctx.strokeRect(this.sx(this.telescopeX + TELESCOPE_W * 0.5), this.sy(TELESCOPE_H * 0.5), this.s(TELESCOPE_W * 0.5), this.s(TELESCOPE_H));
  }
}

function waveColor(starVx) {
  if (starVx < 0) {
    return '#03B3EC';
  } else if (starVx > 0) {
    return '#E80000';
  } else {
    return STAR_COLOR;
  }
}
