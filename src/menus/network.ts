import Menu from "src/components/Menu.svelte";
import { webSocketProxyInstances } from "src/functions/websocket-proxy";

const networkSettings = {
    dropMessagePacket: false,
    dropSentPacket: false
};

let dropMessageController: any = null;
let dropSentController: any = null;

export function bind(menu: Menu) {
    const networkFolder = menu.addFolder("Network");
    dropMessageController = networkFolder.add(networkSettings, "dropMessagePacket")
        .name("dropMessagePacket")
        .onChange((value: boolean) => {
            handleDropMessagePacket(value);
            updateControllerDisplay();
        });
    
    dropSentController = networkFolder.add(networkSettings, "dropSentPacket")
        .name("dropSentPacket")
        .onChange((value: boolean) => {
            handleDropSentPacket(value);
            updateControllerDisplay();
        });
}

function handleDropMessagePacket(enabled: boolean): void {
    webSocketProxyInstances.forEach((connection) => {
        connection.enableMessageProcessing = !enabled;
    });
}

function handleDropSentPacket(enabled: boolean): void {
    webSocketProxyInstances.forEach((connection) => {
        connection.enableSend = !enabled;
    });
}

function updateControllerDisplay(): void {
    if (dropMessageController) {
        const dropMessageName = networkSettings.dropMessagePacket ? "dropMessagePacket(start)" : "dropMessagePacket(stop)";
        dropMessageController.name(dropMessageName);
    }
    
    if (dropSentController) {
        const dropSentName = networkSettings.dropSentPacket ? "dropSentPacket(start)" : "dropSentPacket(stop)";
        dropSentController.name(dropSentName);
    }
}
