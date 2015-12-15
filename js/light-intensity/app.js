import $ from 'jquery';
import EventEmitter from 'eventemitter2';
import View from './view.js';

const TICK_INTERVAL = 20;

const DEF_STATE = {
  time: 0,
  planet: {
    x: -4,
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
    this.calculateOutput();

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

  calculateOutput() {
    this.state.lightIntensity = Math.random();
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
      engine.tick(this.state);
      this.tick += 1;
      if (this.tick % TICK_INTERVAL === 0) {
        this.dispatch.emit('tick', this.state);
      }
    }
    this.view.render(this.state.star, this.state.planet);
    this._rafID = requestAnimationFrame(this._rafCallback);
  }
}
