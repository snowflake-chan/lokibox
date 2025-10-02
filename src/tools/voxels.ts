import { getCore } from "src/tools/core";

let core: Core;
let voxels: Voxel;

export interface VoxelPosition {
    x: number;
    y: number;
    z: number;
}

export interface VoxelRange {
    min: VoxelPosition;
    max: VoxelPosition;
}

getCore().then((v) => {
    core = v;
    voxels = v.game.voxel;
});

export function getVoxel(x: number, y: number, z: number): number {
    return voxels.getVoxel(x, y, z);
}

export function setVoxel(x: number, y: number, z: number, id: number): void {
    voxels._setVoxel(x, y, z, id);
}

export function isEmpty(x: number, y: number, z: number): boolean {
    return !getVoxel(x, y, z);
}

export function isSolid(x: number, y: number, z: number): boolean {
    return !isEmpty(x, y, z);
}

export function calculateVoxelRange(playerPos: VoxelPosition, offset1: VoxelPosition, offset2: VoxelPosition): VoxelRange {
    return {
        min: {
            x: playerPos.x + Math.min(offset1.x, offset2.x),
            y: playerPos.y + Math.min(offset1.y, offset2.y),
            z: playerPos.z + Math.min(offset1.z, offset2.z)
        },
        max: {
            x: playerPos.x + Math.max(offset1.x, offset2.x),
            y: playerPos.y + Math.max(offset1.y, offset2.y),
            z: playerPos.z + Math.max(offset1.z, offset2.z)
        }
    };
}

export function isPositionInRange(pos: VoxelPosition, range: VoxelRange): boolean {
    return pos.x >= range.min.x && pos.x <= range.max.x &&
        pos.y >= range.min.y && pos.y <= range.max.y &&
        pos.z >= range.min.z && pos.z <= range.max.z;
}

export function clearVoxelsInRange(range: VoxelRange): Map<string, { position: VoxelPosition; id: number }> {
    const clearedBlocks = new Map<string, { position: VoxelPosition; id: number }>();

    for (let x = range.min.x; x <= range.max.x; x++) {
        for (let y = range.min.y; y <= range.max.y; y++) {
            for (let z = range.min.z; z <= range.max.z; z++) {
                const key = `${x},${y},${z}`;
                const currentBlock = getVoxel(x, y, z);

                if (currentBlock) {
                    clearedBlocks.set(key, {
                        position: { x, y, z },
                        id: currentBlock
                    });
                    setVoxel(x, y, z, 0);
                }
            }
        }
    }

    return clearedBlocks;
}

export function restoreVoxels(clearedBlocks: Map<string, { position: VoxelPosition; id: number }>): number {
    let restoredCount = 0;

    for (const [_, block] of clearedBlocks) {
        setVoxel(block.position.x, block.position.y, block.position.z, block.id);
        restoredCount++;
    }

    return restoredCount;
}

export function updateVoxelArea(
    range: VoxelRange,
    clearedBlocks: Map<string, { position: VoxelPosition; id: number }>
): void {
    for (let x = range.min.x; x <= range.max.x; x++) {
        for (let y = range.min.y; y <= range.max.y; y++) {
            for (let z = range.min.z; z <= range.max.z; z++) {
                const key = `${x},${y},${z}`;
                const currentBlock = getVoxel(x, y, z);
                if (currentBlock && !clearedBlocks.has(key)) {
                    clearedBlocks.set(key, {
                        position: { x, y, z },
                        id: currentBlock
                    });
                    setVoxel(x, y, z, 0);
                }
            }
        }
    }
}