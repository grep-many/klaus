import type { Object3D, SkinnedMesh } from "three";

export const isSkinnedMesh = (object: Object3D): object is SkinnedMesh => {
  return (object as SkinnedMesh).isSkinnedMesh === true;
};
