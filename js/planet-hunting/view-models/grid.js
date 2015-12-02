import {SF} from '../constants.js';

export default class {
  constructor() {
    let geometry = new THREE.Geometry();
    geometry.dynamic = true;
    let material = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.35});
    this.mesh = new THREE.LineSegments(geometry, material);

    this.setSize(2);
  }

  setSize(newSize) {
    if (this.oldSize === newSize) return;

    let size = newSize * SF; // convert AU to view units
    let steps = 8;
    let step = size / steps;

    let geometry = this.mesh.geometry;
    geometry.vertices.length = 0;
    for (let i = -size; i <= size; i += step) {
      geometry.vertices.push(new THREE.Vector3(-size, i, 0));
      geometry.vertices.push(new THREE.Vector3(size, i, 0));

      geometry.vertices.push(new THREE.Vector3(i, -size, 0));
      geometry.vertices.push(new THREE.Vector3(i, size, 0));
    }
    geometry.verticesNeedUpdate = true;
    this.oldSize = newSize;
  }

  get rootObject() {
    return this.mesh;
  }

  get position() {
    return this.mesh.position;
  }
}
