import EventEmitter from 'eventemitter2';
import {deepExtend} from './utils.js';
import {makeCircularOrbit} from './physics.js';
import * as engine from './engine.js';
import View from './view.js';

const BREAD_CRUMBS_INTERVAL = 5; // add bread crumb every X ticks

const EARTH_MASS = 5.97e24; // [ kg ]
const SUN_MASS = 1.99e30;   // [ kg ]

const DEF_STATE = {
  time: 0,                      // [ year ]
  timestep: 0.001,              // [ year ]
  star: {
    x: 'output',                // [ AU ]
    y: 'output',                // [ AU ]
    vx: 'output',               // [ AU / year ]
    vy: 'output',               // [ AU / year ]
    mass: SUN_MASS / EARTH_MASS // [ earth mass ]
  },
  planet: {
    x: 1,            // [ AU ]
    y: 0,            // [ AU ]
    vx: 'fakeValue', // [ AU / year ] - velocity will be calculated dynamically later!
    vy: 'fakeValue', // [ AU / year ]   See #setCircularVelocity call below.
    diameter: 1,     // [ earth diameter ]
    rocky:    true
  },
  camera: {
    tilt: 90,        // [ deg ], between 0 and 90
    distance: 2.5    // [ AU ]
  },
  telescope: {
    precision: 100,            // [0..100], affects starCamVelocity and lightIntensity
    starCamVelocity: 'output', // [ AU / year ]
    lightIntensity: 'output'   // [0..1], 1 is default intensity without occultation
  }
};
// Velocity will be set in such a way so that its orbit is circular.
makeCircularOrbit(DEF_STATE.planet);

export default class {
  constructor(parentEl) {
    this.state = deepExtend({}, DEF_STATE);
    engine.calculateOutputs(this.state);

    this.view = new View(parentEl);
    this.view.on('camera.change', (cameraState) => {
      this.setState({camera: cameraState});
    });

    this.tick = 0;
    this.isPlaying = false;

    this.dispatch = new EventEmitter();

    this._rafCallback = this._rafCallback.bind(this);
    this._rafCallback();
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
    this._emitStateChange();
  }

  makeCircularOrbit() {
    makeCircularOrbit(this.state.planet);
    this._emitStateChange();
  }

  _rafCallback() {
    if (this.isPlaying) {
      engine.tick(this.state);
      if (this.tick % BREAD_CRUMBS_INTERVAL === 0) {
        this.view.addBreadCrumb(this.state.planet.x, this.state.planet.y);
      }
      this.tick += 1;
      this.dispatch.emit('tick');
      this._emitStateChange();
    }
    this.view.setProps(this.state);
    this.view.render();
    this._rafID = requestAnimationFrame(this._rafCallback);
  }

  _emitStateChange() {
    this.dispatch.emit('state.change', this.state);
  }
}
