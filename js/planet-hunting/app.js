import EventEmitter from 'eventemitter2';
import {deepExtend} from './utils.js';
import {makeCircularOrbit} from './physics.js';
import * as engine from './engine.js';
import View from './view.js';
import presets from './presets.js';
import {SOLAR_MASS} from './constants.js';

const BREAD_CRUMBS_INTERVAL = 5; // add bread crumb every X ticks

const DEF_STATE = {
  time: 0,             // [ year ]
  timestep: 0.01,      // [ year ]
  star: {
    x: 'output',       // [ AU ]           - depends on planet position
    y: 'output',       // [ AU ]
    vx: 'output',      // [ AU / year ]    - depends on planet velocity
    vy: 'output',      // [ AU / year ]
    mass: SOLAR_MASS,  // [ earth masses ]
    scale: 1,
    color: 0xFFFF00
  },
  habitationZone: {
    visible: false,
    innerRadius: 0.95, // [ AU ]
    outerRadius: 1.37  // [ AU ]
  },
  planet: {
    x: 1,            // [ AU ]
    y: 0,            // [ AU ]
    vx: 'fakeValue', // [ AU / year ]      - velocity will be calculated dynamically later!
    vy: 'fakeValue', // [ AU / year ]        See #setCircularVelocity call below.
    diameter: 1,     // [ earth diameter ] - diameter multiplier, 1 => earth diameter
    rocky:    true
  },
  camera: {
    tilt: 90,        // [ deg ], between 0 and 90
    distance: 10,    // [ AU ]
    zoom: 1
  },
  telescope: {
    precision: 100,            // [0..100], affects starCamVelocity and lightIntensity
    starCamVelocity: 'output', // [ AU / year ]
    lightIntensity: 'output'   // [0..1], 1 is default intensity without occultation
  }
};
// Velocity will be set in such a way so that its orbit is circular.
makeCircularOrbit(DEF_STATE.planet, DEF_STATE.star);

export default class {
  constructor(parentEl) {
    this.state = deepExtend({}, DEF_STATE);
    engine.calculateOutputs(this.state);

    this.view = new View(parentEl);
    this.view.on('camera.change', (cameraState) => {
      this.setState({camera: cameraState});
    });
    this.view.on('planet.change', (planetState) => {
      this.setState({planet: planetState});
    });

    this.tick = 0;
    this.isPlaying = false;

    this.dispatch = new EventEmitter();

    this._setupBreadCrumbs();

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

  loadPreset(name) {
    this.setState(presets[name]);
  }

  resize() {
    this.view.resize();
  }

  setState(newState) {
    deepExtend(this.state, newState);
    this._emitStateChange();
  }

  makeCircularOrbit() {
    makeCircularOrbit(this.state.planet, this.state.star);
    this._emitStateChange();
  }

  _rafCallback() {
    if (this.isPlaying) {
      engine.tick(this.state);
      this.tick += 1;
      this.dispatch.emit('tick', this.state);
    }
    // User can interact with the model only when it's paused.
    this.view.interactionEnabled = !this.isPlaying;
    this.view.setProps(this.state);
    this.view.render();
    this._rafID = requestAnimationFrame(this._rafCallback);
  }

  _setupBreadCrumbs() {
    this.on('state.change', (newState) => {
      if (newState.planet.diameter === 0) this.view.clearBreadCrumbs();
    });
    this.on('tick', (newState) => {
      if (this.tick % BREAD_CRUMBS_INTERVAL === 0 && newState.planet.diameter > 0) {
        // Don't add bread crumbs when diameter === 0 what means that there is no planet.
        this.view.addBreadCrumb(newState.planet.x, newState.planet.y);
      }
    });
  }

  _emitStateChange() {
    this.dispatch.emit('state.change', this.state);
  }
}
