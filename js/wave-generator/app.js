import $ from 'jquery';
import EventEmitter from 'eventemitter2';
import View from './view.js';
import {distObj} from '../common/utils.js';
import {tick, MODEL_WIDTH} from './engine.js';

const NOTIFY_TICK_INTERVAL = 10;
const TIMESTEP = 0.001;

const DEF_STATE = {
  time: 0,
  timestep: 0.001,
  star: {
    x: 0,
    y: 0,
    vx: 0,
    diameter: 4
  },
  wave: {
    x: [],
    y: [],
    starVx: []
  },
  starTelescopeVelocity: 0 // output!
};

export default class {
  constructor(parentEl) {
    this.state = $.extend(true, {}, DEF_STATE);

    this.view = new View(parentEl, MODEL_WIDTH);

    this.tick = 0;
    this.isPlaying = false;

    this.dispatch = new EventEmitter();

    this._rafCallback = this._rafCallback.bind(this);
    this._rafCallback();
  }

  calculateOutputs() {
    this.state.starTelescopeVelocity = starTelescopeVelocity(this.state.star);
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

  resize() {
    this.view.resize();
  }

  setState(newState) {
    deepExtend(this.state, newState);
  }

  _rafCallback() {
    if (this.isPlaying) {
      this.tick += 1;
      tick(this.state);
      if (this.tick % NOTIFY_TICK_INTERVAL === 0) {
        this.dispatch.emit('tick', this.state);
      }
    }
    this.view.render(this.state.star, this.state.wave);
    this._rafID = requestAnimationFrame(this._rafCallback);
  }
}

