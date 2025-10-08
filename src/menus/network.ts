import Menu from "src/components/Menu.svelte";
import { webSocketProxyInstances } from "src/functions/websocket-proxy";

const networkSettings = {
    disableMessageProcessing: false,
    disableSending: false
};

let dropMessageController: any = null;
let dropSentController: any = null;

export function bind(menu: Menu) {
    const networkFolder = menu.addFolder("Network");
    dropMessageController = networkFolder.add(networkSettings, "disableMessageProcessing")
        .name("Disable Message Processing")
        .onChange((value: boolean) => {
            handleDropMessagePacket(value);
            updateControllerDisplay();
        });
    
    dropSentController = networkFolder.add(networkSettings, "disableSending")
        .name("Disable Sending")
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
        const dropMessageName = networkSettings.disableMessageProcessing ? "Disable Message Processing (ON)" : "Disable Message Processing (OFF)";
        dropMessageController.name(dropMessageName);
    }
    
    if (dropSentController) {
        const dropSentName = networkSettings.disableSending ? "Disable Sending (ON)" : "Disable Sending (OFF)";
        dropSentController.name(dropSentName);
    }
}
