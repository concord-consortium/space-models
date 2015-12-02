import App from './app';
import labIntegration from './lab-integration.js';

let container = document.getElementById('app');

window.app = new App(container);
labIntegration(window.app);

window.onresize = resizeAppToWindow;
resizeAppToWindow();

function resizeAppToWindow() {
  container.style.width = window.innerWidth + "px";
  container.style.height = window.innerHeight + "px";
  window.app.resize();
}
