import {SF} from '../constants.js';
import Axis from './axis.js';

export default class {
  constructor(size = 1, steps = 8) {
    this.initialSize = size;

    this.geometry = gridGeometry(size, steps);
    this.material = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.35});
    this.mesh = new THREE.LineSegments(this.geometry, this.material);

    this.axis = new Axis(size);
    this.mesh.add(this.axis.rootObject);
  }

  set size(v) {
    if (v === this._oldSize) return;
    // We could regenerate all the geometry, but it's simpler to use scaling (it will handle all the
    // children objects too). In such case, labels won't match size of the grid, so we need to
    // update them manually.
    v = v / this.initialSize;
    this.rootObject.scale.set(v, v, v);
    this.axis.setLabelsRange(v);
    this._oldSize = v;
  }

  get rootObject() {
    return this.mesh;
  }

  get position() {
    return this.mesh.position;
  }
}

function gridGeometry(size, steps) {
  let geometry = new THREE.Geometry();
  size = size * SF;
  let step = size / steps;
  for (let i = -size; i <= size; i += step) {
    geometry.vertices.push(new THREE.Vector3(-size, i, 0));
    geometry.vertices.push(new THREE.Vector3(size, i, 0));
    geometry.vertices.push(new THREE.Vector3(i, -size, 0));
    geometry.vertices.push(new THREE.Vector3(i, size, 0));
  }
  return geometry;
}
