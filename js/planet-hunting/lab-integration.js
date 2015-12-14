import {extend} from './utils.js';
import iframePhone from 'iframe-phone';
import {planetMass} from './physics.js';

const LAB_OUTPUTS = ['time', 'planet.mass', 'camera.tilt', 'telescope.starCamVelocity', 'telescope.lightIntensity'];

export default function(app) {
  let phone = iframePhone.getIFrameEndpoint();
  let propertiesUpdateComingFromLab = false;

  app.on('play', function () {
    phone.post('play.iframe-model');
  });
  app.on('stop', function () {
    phone.post('stop.iframe-model');
  });
  app.on('tick', function (newState) {
    phone.post('tick', {outputs: getLabStdOutputs(newState)});
  });
  app.on('state.change', function (newState) {
    if (!propertiesUpdateComingFromLab) {
      phone.post('properties', getLabProperties(newState));
    }
    phone.post('outputs', getLabStdOutputs(newState));
    // Reset habitability output too, it may require a new analysis.
    phone.post('outputs', getHabitabilityOutputs(null));
  });

  phone.addListener('play', function () {
    app.play();
  });
  phone.addListener('stop', function () {
    app.stop();
  });
  phone.addListener('set', function (content) {
    // 'set' {name: 'planet.x', value: 1} => app.state.planet.x = content.value
    let names = content.name.split('.');
    let stateObj = {};
    let state = stateObj;
    while(names.length > 1) {
      state = state[names.shift()] = {};
    }
    state[names[0]] = content.value;

    propertiesUpdateComingFromLab = true;
    app.setState(stateObj);
    propertiesUpdateComingFromLab = false;
  });
  phone.addListener('makeCircularOrbit', function () {
    app.makeCircularOrbit();
  });
  phone.addListener('loadPreset', function (name) {
    app.loadPreset(name);
  });
  phone.addListener('analyzeHabitability', function () {
    phone.post('outputs', getHabitabilityOutputs(app.analyzeHabitability()));
  });

  phone.initialize();

  phone.post('outputs', getLabStdOutputs(app.state));
}

// Note that planet hunting keeps both outputs and state variables together.
// Lab expects them to be divided.
function getLabProperties(state) {
  let props = flattenObject(state);
  for (let output of LAB_OUTPUTS) {
    delete props[output];
  }
  return props;
}

function getLabStdOutputs(state) {
  let outputs = {};
  outputs['time'] = state.time;
  outputs['planet.mass'] = planetMass(state.planet);
  outputs['camera.tilt'] = state.camera.tilt;
  outputs['telescope.starCamVelocity'] = state.telescope.starCamVelocity;
  outputs['telescope.lightIntensity'] = state.telescope.lightIntensity;
  return outputs;
}

function getHabitabilityOutputs(results) {
  return {
    'habitability.starType': results ? results.starType : null,
    'habitability.planetType': results ? results.planetType : null,
    'habitability.planetSize': results ? results.planetSize : null,
    'habitability.orbitalDistance': results ? results.orbitalDistance : null
  };
}

// Flattens state, as Lab doesn't support nested properties.
// E.g. {timestep: 1, planet: {x: 1, y: 2}} => {'timestep': 1, 'planet.x': 1, 'planet.y': 2}
function flattenObject(value, prefix = null, result = {}) {
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    // Simple value like number, string or array.
    result[prefix] = value;
    return;
  }
  Object.keys(value).forEach(function (key) {
    flattenObject(value[key], prefix ? prefix + '.' + key : key, result);
  });
  return result;
}
