import {SF} from '../constants.js';
import Label from './label.js';

export default class {
  constructor(size = 1, ticks = 4) {
    this.size = size;
    this.ticks = ticks;

    this.geometry = axisGeometry(size, ticks);
    this.material = new THREE.LineBasicMaterial({color: 0xffffaa, linewidth: 2});
    this.mesh = new THREE.LineSegments(this.geometry, this.material);

    this.labels = [];
    this.setLabelsRange(size);
  }

  setLabelsRange(maxValue) {
    this.labels.forEach((lbl) => {
      this.mesh.remove(lbl.rootObject);
      lbl.dispose();
    });
    this.labels = [];

    for (let i = 1; i <= this.ticks; i++) {
      let lbl = new Label((maxValue * i / this.ticks).toFixed(2) + ' AU');
      lbl.position.y = this.size * SF * i / this.ticks;
      this.labels.push(lbl);
      this.mesh.add(lbl.rootObject);
    }
  }

  get rootObject() {
    return this.mesh;
  }

  get position() {
    return this.mesh.position;
  }
}

function axisGeometry(size, ticks) {
  let geometry = new THREE.Geometry();
  let len = size * SF; // convert AU to view units
  let tickWidth = len / 70;
  // Main axis.
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, len, 0));
  // Tick marks.
  for (let i = 1; i <= ticks; i++) {
    geometry.vertices.push(new THREE.Vector3(-tickWidth, len * i / ticks, 0));
    geometry.vertices.push(new THREE.Vector3(tickWidth, len * i / ticks, 0));
  }
  return geometry;
}
