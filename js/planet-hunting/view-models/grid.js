import {SF} from '../constants.js';

export default class {
  constructor() {
    let steps = 8;
    let size = 2 * SF;
    let step = size / steps;

    let geometry = new THREE.Geometry();
    let material = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.35});

    for (let i = -size; i <= size; i += step) {
      geometry.vertices.push(new THREE.Vector3(-size, i, 0));
      geometry.vertices.push(new THREE.Vector3(size, i, 0));

      geometry.vertices.push(new THREE.Vector3(i, -size, 0));
      geometry.vertices.push(new THREE.Vector3(i, size, 0));

    }
    this.mesh = new THREE.LineSegments(geometry, material);
  }

  get rootObject() {
    return this.mesh;
  }

  get position() {
    return this.mesh.position;
  }
}
