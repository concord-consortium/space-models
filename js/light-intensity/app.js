import $ from 'jquery';
import EventEmitter from 'eventemitter2';
import View from './view.js';
import {distObj} from '../common/utils.js';

const NOTIFY_TICK_INTERVAL = 10;
const TIMESTEP = 0.001;

const DEF_STATE = {
  time: 0,
  planet: {
    x: -6,
    y: 0,
    diameter: 1
  },
  star: {
    x: 0,
    y: 0,
    diameter: 6
  },
  lightIntensity: 'output' // [0, 1]
};

export default class {
  constructor(parentEl) {
    this.state = $.extend(true, {}, DEF_STATE);
    this.calculateOutputs();

    this.view = new View(parentEl);
    this.view.on('planet.change', (planetState) => {
      this.state.planet.x = planetState.x;
      this.state.planet.y = planetState.y;
    });

    this.tick = 0;
    this.isPlaying = false;

    this.dispatch = new EventEmitter();

    this._rafCallback = this._rafCallback.bind(this);
    this._rafCallback();
  }

  calculateOutputs() {
    this.state.lightIntensity = lightIntensity(this.state.star, this.state.planet);
  }

  on() {
    // Delegate #on to EventEmitter object.
    this.dispatch.on.apply(this.dispatch, arguments);
  }

  play() {
    this.isPlaying = true;
    this.dispatch.emit('play');
  }

  stop() {
    this.isPlaying = false;
    this.dispatch.emit('stop');
  }

  repaint() {
    this.view.render(this.state.star, this.state.planet);
  }

  resize() {
    this.view.resize();
  }

  setState(newState) {
    deepExtend(this.state, newState);
  }

  _rafCallback() {
    if (this.isPlaying) {
      this.tick += 1;
      this.state.time += TIMESTEP;
      if (this.tick % NOTIFY_TICK_INTERVAL === 0) {
        this.calculateOutputs();
        this.dispatch.emit('tick', this.state);
      }
    }
    this.repaint();
    this._rafID = requestAnimationFrame(this._rafCallback);
  }
}

function lightIntensity(star, planet) {
  let planetR = planet.diameter * 0.5;
  let starR = star.diameter * 0.5;
  let planetArea = Math.PI * planetR * planetR;
  let starArea = Math.PI * starR * starR;
  let d = distObj(star, planet);
  let biggerR = Math.max(star.diameter, planet.diameter) * 0.5;
  let smallerR = Math.min(star.diameter, planet.diameter) * 0.5;
  let ratio = Math.max(0, Math.min(1, 1 - (d - (biggerR - smallerR)) / (2 * smallerR)));
  return 1 - ratio * Math.min(1, planetArea / starArea);
}
