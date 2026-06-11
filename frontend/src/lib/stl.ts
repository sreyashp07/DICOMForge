import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

export function parseStl(buffer: ArrayBuffer): THREE.BufferGeometry {
  const geo = new STLLoader().parse(buffer);
  geo.center();
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

export function triangleCount(geo: THREE.BufferGeometry): number {
  const pos = geo.getAttribute("position");
  return pos ? Math.floor(pos.count / 3) : 0;
}
