import {extend} from './utils.js';
import iframePhone from 'iframe-phone';
import {planetMass} from './physics.js';

export default function(app) {
  let phone = iframePhone.getIFrameEndpoint();

  app.on('play', function () {
    phone.post('play.iframe-model');
  });
  app.on('stop', function () {
    phone.post('stop.iframe-model');
  });
  app.on('tick', function () {
    phone.post('tick');
  });
  app.on('state.change', function (newState) {
    phone.post('outputs', getOutputs(newState));
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
    app.setState(stateObj);
  });

  phone.initialize();

  phone.post('outputs', getOutputs(app.state));
}

function getOutputs(state) {
  let outputs = {};
  outputs['planet.mass'] = planetMass(state.planet);
  outputs['camera.tilt'] = state.camera.tilt;
  return outputs;
}