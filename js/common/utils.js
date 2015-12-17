import $ from 'jquery';

export function dist(x1, y1, z1, x2, y2, z2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
}

export function distObj(a, b) {
  return dist(a.x, a.y, a.z || 0, b.x, b.y, b.z || 0);
}

// Mouse (or touch) position in pixels.
export function mousePos(event, targetElement) {
  let $targetElement = $(targetElement);
  let parentX = $targetElement.offset().left;
  let parentY = $targetElement.offset().top;
  if (event.originalEvent.touches) {
    event = event.originalEvent.touches[0];
  }
  return {x: event.pageX - parentX, y: event.pageY - parentY};
}

// Mouse (or touch) position in pixels, but it takes into account
// device pixel ratio (e.g. Retina display).
export function mousePosHD(evt, target) {
  let p = mousePos(evt, target);
  p.x *= window.devicePixelRatio;
  p.y *= window.devicePixelRatio;
  return p;
}

export function stdAppInitialization(App, labIntegration, containerID = 'app') {
  let container = document.getElementById(containerID);

  window.app = new App(container);
  labIntegration(window.app);

  window.onresize = resizeAppToWindow;
  resizeAppToWindow();

  function resizeAppToWindow() {
    container.style.width = window.innerWidth + "px";
    container.style.height = window.innerHeight + "px";
    window.app.resize();
  }
}
