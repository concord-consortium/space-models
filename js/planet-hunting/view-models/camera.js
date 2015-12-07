import {SF} from '../constants.js';

const ROTATION_AXIS = new THREE.Vector3(1, 0, 0);
const ZERO_TILT_VEC = new THREE.Vector3(0, -1, 0);
const ZOOM_SPEED = 1.013;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 15;

export default class {
  constructor(canvas) {
    this.camera = new THREE.PerspectiveCamera(15, 1, 0.1 * SF, 1000 * SF);
    this.position.z = 2.5 * SF;

    this.controls = new THREE.OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;
    this.controls.enableZoom = false;
    this.controls.minPolarAngle = Math.PI * 0.5;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minAzimuthAngle = 0;
    this.controls.maxAzimuthAngle = 0;
    this.controls.rotateSpeed = 0.5;

    this.oldProps = {};
    this.changeCallback = function() { /* noop */ };

    canvas.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
  }

  get position() {
    return this.camera.position;
  }

  set locked(v) {
    this.controls.enableRotate = !v;
  }

  // On change caused by user interaction.
  onChange(callback) {
    this.changeCallback = callback;
    this.controls.addEventListener('change', callback);
  }

  setProps(props) {
    if (this.oldProps.tilt !== props.tilt) {
      let angleDiff = this.position.angleTo(ZERO_TILT_VEC);
      let tiltInRad = props.tilt * Math.PI / 180;
      this.position.applyAxisAngle(ROTATION_AXIS, angleDiff - tiltInRad);
      this.controls.update();
      this.oldProps.tilt = props.tilt;
    }
    if (this.oldProps.distance !== props.distance) {
      this.position.setLength(props.distance * SF);
      this.oldProps.distance = props.distance;
    }
    if (this.oldProps.zoom !== props.zoom) {
      this.camera.zoom = props.zoom;
      this.camera.updateProjectionMatrix();
    }
  }

  getProps() {
    let props = {};
    props.tilt = this.position.angleTo(ZERO_TILT_VEC) * 180 / Math.PI;
    props.distance = this.position.length() / SF;
    props.zoom = this.camera.zoom;
    return props;
  }

  // Tilt is defined in degrees and it has a bit different range than control's polar angle
  // (from 0 to 90, while the polar angle is between PI/2 and PI).
  setTilt(tiltInDeg) {
    let newPolarAngle = (180 - tiltInDeg) * Math.PI / 180;
    let polarAngleDiff = newPolarAngle - this.controls.getPolarAngle();
    this.controls.constraint.rotateUp(polarAngleDiff);
  }

  setSize(newWidth, newHeight) {
    this.camera.aspect = newWidth / newHeight;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }

  zoomIn() {
    this.camera.zoom = Math.min(ZOOM_MAX, this.camera.zoom * ZOOM_SPEED);
    this.camera.updateProjectionMatrix();
    this.changeCallback();
  }

  zoomOut() {
    this.camera.zoom = Math.max(ZOOM_MIN, this.camera.zoom / ZOOM_SPEED);
    this.camera.updateProjectionMatrix();
    this.changeCallback();
  }


  onMouseWheel(event) {
    event.preventDefault();
    event.stopPropagation();
    let delta = 0;
    if (event.wheelDelta !== undefined) {
      // WebKit / Opera / Explorer 9
      delta = event.wheelDelta;
    } else if (event.detail !== undefined) {
      // Firefox
      delta = -event.detail;
    }
    if (delta > 0) {
      this.zoomIn();
    } else if (delta < 0) {
      this.zoomOut();
    }
  }
}
