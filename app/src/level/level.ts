/* eslint-disable max-classes-per-file */
import {
  Scene,
  Vector3,
  Mesh,
  TextureLoader,
  MathUtils,
  BufferGeometry,
  MeshLambertMaterial,
  BufferAttribute,
  Color,
  DirectionalLight,
  NearestFilter,
  PerspectiveCamera,
} from 'three';

import { neighborOffsetCoordinates } from '../constants/constants';

import atlas from '../../assets/img/atlas.png';

import DataStore from '../core/dataStore';
import Voxel, { VoxelTypes } from '../entities/voxel';

interface ChunkGeometry {
  positions: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
}

interface IntersectRay {
  position: number[];
  normal: number[];
  voxel: Voxel;
}

export default class Level {
  private _scene: Scene;
  private _isLoaded = false;
  private _blockCount = 0;

  private _chunkSize = 32; // TODO move to settings
  private _chunkArea: number = this._chunkSize * this._chunkSize;
  private _chunkVolume: number = this._chunkSize * this._chunkSize * this._chunkSize;
  private _chunks: Map<string, Array<Voxel>> = new Map();
  private _meshes = new Map();

  private _tileSize = 64; // TODO move to settings
  private _tileTextureWidth = 256; // TODO make dynamic
  private _tileTextureHeight = 192; // TODO make dynamic
  private _material: MeshLambertMaterial; // TODO move to texture loader

  // TODO move somewhere..
  private _faces = [
    {
      // top
      uvRow: 0,
      dir: neighborOffsetCoordinates[1],
      corners: [
        { pos: [0, 1, 1], uv: [1, 1] },
        { pos: [1, 1, 1], uv: [0, 1] },
        { pos: [0, 1, 0], uv: [1, 0] },
        { pos: [1, 1, 0], uv: [0, 0] },
      ],
    },
    {
      // front
      uvRow: 1,
      dir: neighborOffsetCoordinates[2],
      corners: [
        { pos: [0, 0, 1], uv: [0, 0] },
        { pos: [1, 0, 1], uv: [1, 0] },
        { pos: [0, 1, 1], uv: [0, 1] },
        { pos: [1, 1, 1], uv: [1, 1] },
      ],
    },
    {
      // back
      uvRow: 1,
      dir: neighborOffsetCoordinates[3],
      corners: [
        { pos: [1, 0, 0], uv: [0, 0] },
        { pos: [0, 0, 0], uv: [1, 0] },
        { pos: [1, 1, 0], uv: [0, 1] },
        { pos: [0, 1, 0], uv: [1, 1] },
      ],
    },
    {
      // left
      uvRow: 1,
      dir: neighborOffsetCoordinates[4],
      corners: [
        { pos: [0, 1, 0], uv: [0, 1] },
        { pos: [0, 0, 0], uv: [0, 0] },
        { pos: [0, 1, 1], uv: [1, 1] },
        { pos: [0, 0, 1], uv: [1, 0] },
      ],
    },
    {
      // right
      uvRow: 1,
      dir: neighborOffsetCoordinates[5],
      corners: [
        { pos: [1, 1, 1], uv: [0, 1] },
        { pos: [1, 0, 1], uv: [0, 0] },
        { pos: [1, 1, 0], uv: [1, 1] },
        { pos: [1, 0, 0], uv: [1, 0] },
      ],
    },
    {
      // bottom
      uvRow: 2,
      dir: neighborOffsetCoordinates[6],
      corners: [
        { pos: [1, 0, 1], uv: [1, 0] },
        { pos: [0, 0, 1], uv: [0, 0] },
        { pos: [1, 0, 0], uv: [1, 1] },
        { pos: [0, 0, 0], uv: [0, 1] },
      ],
    },
  ];

  public constructor() {
    this._scene = new Scene();
    this._scene.background = new Color('darkolivegreen');

    this.addLight(-1, 2, 4);
    this.addLight(1, -1, -2);

    const loader = new TextureLoader();
    const texture = loader.load(atlas);
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;

    this._material = new MeshLambertMaterial({
      map: texture,
      // side: DoubleSide, // TODO add transparent blocks
      alphaTest: 0.1,
      transparent: true,
    });
  }

  public get internalScene(): Scene {
    return this._scene;
  }

  public get isLoaded(): boolean {
    return this._isLoaded;
  }

  public get blockCount(): number {
    return this._blockCount;
  }

  private addLight(x: number, y: number, z: number): void {
    const color = 0xffffff;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(x, y, z);
    this._scene.add(light);
  }

  private computeChunkID(x: number, y: number, z: number): string {
    const { _chunkSize } = this;
    const cellX = Math.floor(x / _chunkSize);
    const cellY = Math.floor(y / _chunkSize);
    const cellZ = Math.floor(z / _chunkSize);
    return `${cellX},${cellY},${cellZ}`;
  }

  private getChunkForVoxel(x: number, y: number, z: number): Array<Voxel> | null {
    return this._chunks.get(this.computeChunkID(x, y, z)) || null;
  }

  private addChunkForVoxel(x: number, y: number, z: number): Array<Voxel> {
    const chunkID = this.computeChunkID(x, y, z);
    let chunk = this._chunks.get(chunkID);
    if (!chunk) {
      chunk = new Array<Voxel>(this._chunkVolume);
      this._chunks.set(chunkID, chunk);
    }
    return chunk;
  }

  private computeVoxelPosition(x: number, y: number, z: number): number {
    const { _chunkSize, _chunkArea } = this;
    /* eslint-disable no-bitwise */
    const offsetX = MathUtils.euclideanModulo(x, _chunkSize) | 0;
    const offsetY = MathUtils.euclideanModulo(y, _chunkSize) | 0;
    const offsetZ = MathUtils.euclideanModulo(z, _chunkSize) | 0;
    /* eslint-enable no-bitwise */
    return offsetX + offsetY * _chunkArea + offsetZ * _chunkSize;
  }

  private setVoxel(voxel: Voxel, x: number, y: number, z: number): void {
    let chunk = this.getChunkForVoxel(x, y, z);
    if (!chunk) {
      chunk = this.addChunkForVoxel(x, y, z);
    }
    const position = this.computeVoxelPosition(x, y, z);
    if (chunk[position]) {
      DataStore.removeEntity(chunk[position].id);
    }
    chunk[position] = voxel;
  }

  private generateInitialChunk(): void {
    for (let y = 0; y < this._chunkSize; y += 1) {
      for (let z = 0; z < this._chunkSize; z += 1) {
        for (let x = 0; x < this._chunkSize; x += 1) {
          const height =
            (Math.sin((x / this._chunkSize) * Math.PI * 2) +
              Math.sin((z / this._chunkSize) * Math.PI * 3)) *
              (this._chunkSize / 6) +
            this._chunkSize / 2;
          if (y < height) {
            this._blockCount += 1;
            const rnd = Math.floor(1 + Math.random() * 4); // 1 - 4, because 0 is empty
            const voxelType = rnd === 1 && y !== Math.floor(height) ? 2 : rnd;
            this.setVoxel(new Voxel(Object.values(VoxelTypes)[voxelType]), x, y, z);
          }
        }
      }
    }
  }

  private getVoxel(x: number, y: number, z: number): Voxel | null {
    const chunk = this.getChunkForVoxel(x, y, z);
    if (!chunk) {
      return null;
    }
    const position = this.computeVoxelPosition(x, y, z);
    return chunk[position];
  }

  private generateChunkGeometry(chunkX: number, chunkY: number, chunkZ: number): ChunkGeometry {
    const { _chunkSize, _tileSize, _tileTextureWidth, _tileTextureHeight } = this; // TODO remove texture sizes
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    const startX = chunkX * _chunkSize;
    const startY = chunkY * _chunkSize;
    const startZ = chunkZ * _chunkSize;

    for (let y = 0; y < _chunkSize; y += 1) {
      const voxelY = startY + y;
      for (let z = 0; z < _chunkSize; z += 1) {
        const voxelZ = startZ + z;
        for (let x = 0; x < _chunkSize; x += 1) {
          const voxelX = startX + x;
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
          if (voxel && voxel.type !== VoxelTypes.NONE) {
            const uvVoxel = Object.keys(VoxelTypes).indexOf(voxel.type) - 1; // voxel type 0 is empty
            // There is a voxel here but do we need faces for it?
            this._faces.forEach(({ dir, corners, uvRow }) => {
              const neighborVoxel = this.getVoxel(
                voxelX + dir[0],
                voxelY + dir[1],
                voxelZ + dir[2],
              );
              if (!neighborVoxel || neighborVoxel.type === VoxelTypes.NONE) {
                // this voxel has no neighbor in this direction so we need a face.
                const ndx = positions.length / 3;
                corners.forEach(({ pos, uv }) => {
                  positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                  normals.push(...dir);
                  uvs.push(
                    ((uvVoxel + uv[0]) * _tileSize) / _tileTextureWidth,
                    1 - ((uvRow + 1 - uv[1]) * _tileSize) / _tileTextureHeight,
                  );
                });
                indices.push(ndx, ndx + 1, ndx + 2, ndx + 2, ndx + 1, ndx + 3);
              }
            });
          }
        }
      }
    }

    return { positions, normals, uvs, indices };
  }

  /**
   * Creates a voxel world level - generates starting chunk, loads and applies voxel textures.
   * TODO - move texture loading elsewhere
   *
   * @memberof Level
   */
  public load(): void {
    this.generateInitialChunk();
    this.updateChunkGeometry(0, 0, 0);
    this._isLoaded = true;
    console.log('===== Level Loaded =====');
  }

  public unload(): void {
    this._isLoaded = false;
  }

  private updateChunkGeometry(x: number, y: number, z: number): void {
    const chunkX = Math.floor(x / this._chunkSize);
    const chunkY = Math.floor(y / this._chunkSize);
    const chunkZ = Math.floor(z / this._chunkSize);
    const chunkID = this.computeChunkID(x, y, z);
    let mesh = this._meshes.get(chunkID);
    const geometry = mesh ? mesh.geometry : new BufferGeometry();

    // TODO - Refactor so as not to generate the chunk geometry from scratch on each update
    const { positions, normals, uvs, indices } = this.generateChunkGeometry(chunkX, chunkY, chunkZ);
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;

    geometry.setIndex(indices);
    geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(positions), positionNumComponents),
    );
    geometry.setAttribute(
      'normal',
      new BufferAttribute(new Float32Array(normals), normalNumComponents),
    );
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), uvNumComponents));
    geometry.computeBoundingSphere();

    if (!mesh) {
      mesh = new Mesh(geometry, this._material);
      mesh.name = chunkID;
      this._meshes.set(chunkID, mesh);
      this._scene.add(mesh);
      mesh.position.set(
        chunkX * this._chunkSize,
        chunkY * this._chunkSize,
        chunkZ * this._chunkSize,
      );
    }
  }

  private updateVoxelGeometry(x: number, y: number, z: number): void {
    const updatedChunkIDs = new Map();
    neighborOffsetCoordinates.forEach(offset => {
      const ox = x + offset[0];
      const oy = y + offset[1];
      const oz = z + offset[2];
      const chunkID = this.computeChunkID(ox, oy, oz);
      if (!updatedChunkIDs.get(chunkID)) {
        updatedChunkIDs.set(chunkID, true);
        this.updateChunkGeometry(ox, oy, oz);
      }
    });
  }

  private intersectRay(start: Vector3, end: Vector3): IntersectRay | null {
    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let dz = end.z - start.z;
    const lenSq = dx * dx + dy * dy + dz * dz;
    const len = Math.sqrt(lenSq);

    dx /= len;
    dy /= len;
    dz /= len;

    let t = 0.0;
    let ix = Math.floor(start.x);
    let iy = Math.floor(start.y);
    let iz = Math.floor(start.z);

    const stepX = dx > 0 ? 1 : -1;
    const stepY = dy > 0 ? 1 : -1;
    const stepZ = dz > 0 ? 1 : -1;

    const txDelta = Math.abs(1 / dx);
    const tyDelta = Math.abs(1 / dy);
    const tzDelta = Math.abs(1 / dz);

    const xDist = stepX > 0 ? ix + 1 - start.x : start.x - ix;
    const yDist = stepY > 0 ? iy + 1 - start.y : start.y - iy;
    const zDist = stepZ > 0 ? iz + 1 - start.z : start.z - iz;

    // location of nearest voxel boundary, in units of t
    let txMax = txDelta < Infinity ? txDelta * xDist : Infinity;
    let tyMax = tyDelta < Infinity ? tyDelta * yDist : Infinity;
    let tzMax = tzDelta < Infinity ? tzDelta * zDist : Infinity;

    let steppedIndex = -1;

    // main loop along raycast vector
    while (t <= len) {
      const voxel = this.getVoxel(ix, iy, iz);
      if (voxel && voxel.type !== VoxelTypes.NONE) {
        return {
          position: [start.x + t * dx, start.y + t * dy, start.z + t * dz],
          normal: [
            steppedIndex === 0 ? -stepX : 0,
            steppedIndex === 1 ? -stepY : 0,
            steppedIndex === 2 ? -stepZ : 0,
          ],
          voxel,
        };
      }

      // advance t to next nearest voxel boundary
      if (txMax < tyMax) {
        if (txMax < tzMax) {
          ix += stepX;
          t = txMax;
          txMax += txDelta;
          steppedIndex = 0;
        } else {
          iz += stepZ;
          t = tzMax;
          tzMax += tzDelta;
          steppedIndex = 2;
        }
      } else if (tyMax < tzMax) {
        iy += stepY;
        t = tyMax;
        tyMax += tyDelta;
        steppedIndex = 1;
      } else {
        iz += stepZ;
        t = tzMax;
        tzMax += tzDelta;
        steppedIndex = 2;
      }
    }
    return null;
  }

  /**
   * Modifies a voxel in the voxel level
   *
   * @param {*} camera Game camera
   * @param {*} removeMode Wether voxel should be added or removed. TODO - change to voxel enum type
   * @memberof Level
   */
  public placeVoxel(camera: PerspectiveCamera, removeMode: boolean): void {
    const start = new Vector3();
    const end = new Vector3();
    start.setFromMatrixPosition(camera.matrixWorld);
    end.set(0, 0, 1).unproject(camera);

    const intersection = this.intersectRay(start, end);

    if (intersection) {
      const voxel = removeMode ? new Voxel(VoxelTypes.NONE) : new Voxel(VoxelTypes.DIRT);
      const block = removeMode ? -1 : 1;
      // TODO change block count to length of entities
      this._blockCount += block;
      // the intersection point is on the face. That means
      // the math imprecision could put us on either side of the face.
      // so go half a normal into the voxel if removing (currentVoxel = 0)
      // our out of the voxel if adding (currentVoxel  > 0)
      const pos = intersection.position.map((v, ndx) => {
        return v + intersection.normal[ndx] * (voxel.type !== VoxelTypes.NONE ? 0.5 : -0.5);
      });

      this.setVoxel(voxel, pos[0], pos[1], pos[2]);
      this.updateVoxelGeometry(pos[0], pos[1], pos[2]);
    }
  }
}
