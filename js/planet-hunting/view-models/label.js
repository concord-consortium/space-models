import {SF} from '../constants.js';

export default class {
  constructor(text) {
    let size = 0.03 * SF;
    this.geometry = new THREE.TextGeometry(text, {
      size: size,
      height: 1e-6 * SF
    });
    this.material = new THREE.LineBasicMaterial({color: 0xffffaa});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = size;
    this.mesh.position.y = -size * 0.5;

    this.posObject = new THREE.Object3D();
    this.posObject.add(this.mesh);
  }

  get rootObject() {
    return this.posObject;
  }

  get position() {
    return this.posObject.position;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
