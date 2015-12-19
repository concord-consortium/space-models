import {SF} from '../constants.js';

const INTERACTION_RADIUS = 0.15 * SF;

export default function () {
  let interactionGeometry = new THREE.SphereGeometry(INTERACTION_RADIUS, 8, 8);
  let interactionMesh = new THREE.Mesh(interactionGeometry, new THREE.MeshBasicMaterial({transparent: true, opacity: 0}));
  // Render this object after all transparent objects.
  // Otherwise, we can see some rendering artifacts caused by other transparent objects (e.g. grid).
  interactionMesh.renderOrder = Infinity;
  return interactionMesh;
}
