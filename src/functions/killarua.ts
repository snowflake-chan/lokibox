import {
    setCameraTargetId,
    getPlayerId
} from "src/tools/arch";
import { getEnemyInRange, TargetMode } from "src/functions/aimassist";

export interface KillAuraConfig {
    range: number;
    enabled: boolean;
}

let intervalId: number | null = null;
let config: KillAuraConfig = {
    range: 5,
    enabled: false
};

function update(): void {
    const targetId = getEnemyInRange(config.range, TargetMode.RANDOM);
    if (targetId) {
        setCameraTargetId(targetId);
    } else {
        const selfId = getPlayerId();
        if (selfId) {
            setCameraTargetId(selfId);
        }
    }
}

export function enableKillAura(): void {
    if (config.enabled) return;
    config.enabled = true;
    intervalId = setInterval(update, 100);
}

export function disableKillAura(): void {
    if (!config.enabled) return;

    config.enabled = false;
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }

    const selfId = getPlayerId();
    if (selfId) {
        setCameraTargetId(selfId);
    }
}

export function updateKillAuraConfig(newConfig: Partial<KillAuraConfig>): void {
    const wasEnabled = config.enabled;

    if (wasEnabled) {
        disableKillAura();
    }

    config = { ...config, ...newConfig };

    if (wasEnabled) {
        enableKillAura();
    }
}

export function isKillAuraEnabled(): boolean {
    return config.enabled;
}

export function getKillAuraConfig(): KillAuraConfig {
    return { ...config };
}

export function setKillAuraRange(range: number): void {
    updateKillAuraConfig({ range });
}