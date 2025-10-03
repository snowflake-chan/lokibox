import { calculateVoxelRange, updateVoxelArea, restoreVoxels } from "src/tools/voxels";
import { getSelfBody } from "src/tools/arch";

export interface GhostConfig {
    offset1: { x: number; y: number; z: number };
    offset2: { x: number; y: number; z: number };
    enabled: boolean;
}

let intervalId: number | null = null;
let clearedBlocks = new Map<string, { position: { x: number; y: number; z: number }; id: number }>();
let config: GhostConfig = {
    offset1: { x: -1, y: -1, z: -1 },
    offset2: { x: 1, y: 1, z: 1 },
    enabled: false
};

function update(): void {
    const playerPos = {
        x: parseInt(getSelfBody().px.toString()),
        y: parseInt(getSelfBody().py.toString()),
        z: parseInt(getSelfBody().pz.toString())
    };
    if (!playerPos) return;

    const range = calculateVoxelRange(playerPos, config.offset1, config.offset2);
    updateVoxelArea(range, clearedBlocks);
}

export function enableGhost(): void {
    if (config.enabled) return;

    config.enabled = true;
    clearedBlocks.clear();
    intervalId = setInterval(() => {
        update();
    }, 50);

    console.log("🔮 Ghost mode enabled");
}

export function disableGhost(): void {
    if (!config.enabled) return;
    config.enabled = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    const restoredCount = restoreVoxels(clearedBlocks);
    clearedBlocks.clear();

    console.log(`🔮 Ghost mode disabled, restored ${restoredCount} blocks`);
}

export function updateGhostConfig(newConfig: Partial<GhostConfig>): void {
    config = { ...config, ...newConfig };
}

export function getGhostConfig(): GhostConfig {
    return { ...config };
}

export function setGhostRange(offset1: { x: number; y: number; z: number }, offset2: { x: number; y: number; z: number }): void {
    updateGhostConfig({ offset1, offset2 });
}