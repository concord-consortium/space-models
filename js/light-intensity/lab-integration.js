import iframePhone from 'iframe-phone';

export default function(app) {
  let phone = iframePhone.getIFrameEndpoint();

  app.on('play', function () {
    phone.post('play.iframe-model');
  });
  app.on('stop', function () {
    phone.post('stop.iframe-model');
  });
  app.on('tick', function (newState) {
    phone.post('tick', {outputs: getLabOutputs(newState)});
  });

  phone.addListener('play', function () {
    app.play();
  });
  phone.addListener('stop', function () {
    app.stop();
  });
  phone.addListener('set', function (content) {
    if (content.name === 'planet.diameter') {
      app.state.planet.diameter = content.value;
    }
  });

  phone.initialize();
  phone.post('outputs', getLabOutputs(app.state));
}

function getLabOutputs(state) {
  return {
    time: state.time,
    lightIntensity: state.lightIntensity
  };
}
