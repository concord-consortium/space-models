import {SF} from '../constants.js';

export default class {
  constructor() {
    this.outerGeometry = new THREE.RingGeometry(0, 1, 64);
    this.outerMaterial = new THREE.MeshBasicMaterial({color: 0x3DB5FF, side: THREE.DoubleSide, transparent: true, opacity: 0.25});
    this.outerMesh = new THREE.Mesh(this.outerGeometry, this.outerMaterial);
    // Set ring a bit above 0 (=> above grid and axis).
    this.outerMesh.position.z = 0.004 * SF;

    this.innerGeometry = new THREE.RingGeometry(0, 1, 64);
    this.innerMaterial = new THREE.MeshBasicMaterial({color: 0x00000, side: THREE.DoubleSide, transparent: true, opacity: 0.6});
    this.innerMesh = new THREE.Mesh(this.innerGeometry, this.innerMaterial);
    this.innerMesh.position.z = 0.005 * SF;

    this.posObject = new THREE.Object3D();
    this.posObject.add(this.outerMesh);
    this.posObject.add(this.innerMesh);
  }

  get rootObject() {
    return this.posObject;
  }

  set innerRadius(v) {
    v = v * SF;
    this.innerMesh.scale.set(v, v, v);
  }

  set outerRadius(v) {
    v = v * SF;
    this.outerMesh.scale.set(v, v, v);
  }

  setProps(props) {
    this.rootObject.visible = props.visible;
    this.innerRadius = props.innerRadius;
    this.outerRadius = props.outerRadius;
  }
}
