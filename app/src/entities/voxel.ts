import Entity from './entity';

export enum VoxelTypes {
  NONE = 'NONE',
  GRASS = 'GRASS',
  DIRT = 'DIRT',
  SAND = 'SAND',
  ROCK = 'ROCK',
}

class Voxel extends Entity {
  private _type: VoxelTypes;

  constructor(type: VoxelTypes) {
    super();
    this._type = type;
  }

  public get type(): VoxelTypes {
    return this._type;
  }
}

export default Voxel;
