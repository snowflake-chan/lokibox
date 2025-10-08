import { unsafeWindow } from "$";

const originalWebSocket = unsafeWindow.WebSocket;
export const webSocketProxyInstances: WebSocketProxy[] = [];

export class WebSocketProxy {
    private readonly originalWebSocket: WebSocket;
    private messageHandlers: ((event: MessageEvent) => void)[] = [];
    public enableMessageProcessing: boolean = true;
    public enableSend: boolean = true;
    public onmessage: (event: MessageEvent) => void = () => { };
    
    constructor(url: string, protocols?: string | string[]) {
        this.originalWebSocket = new originalWebSocket(url, protocols);
        this.originalWebSocket.addEventListener("message", (event: MessageEvent) => {
            if (this.enableMessageProcessing) {
                this.messageHandlers.forEach(handler => handler(event));
            }
        });
        this.addEventListener("message", (event: MessageEvent) => this.onmessage(event));
        webSocketProxyInstances.push(this);
    }
    
    addEventListener(type: string, callback: (event: any) => void): void {
        if (type === "message") {
            this.messageHandlers.push(callback);
        } else {
            this.originalWebSocket.addEventListener(type, callback);
        }
    }
    
    send(data: any): void {
        if (this.enableSend) {
            this.originalWebSocket.send(data);
        }
    }
    
    close(): void {
        this.originalWebSocket.close();
    }
    
    get url(): string { return this.originalWebSocket.url; }
    get protocol(): string { return this.originalWebSocket.protocol; }
    get bufferedAmount(): number { return this.originalWebSocket.bufferedAmount; }
    get extensions(): string { return this.originalWebSocket.extensions; }
    get binaryType(): BinaryType { return this.originalWebSocket.binaryType; }
    set binaryType(type: BinaryType) { this.originalWebSocket.binaryType = type; }
    get readyState(): number { return this.originalWebSocket.readyState; }
    get onopen(): ((event: Event) => void) | null { return this.originalWebSocket.onopen; }
    set onopen(handler: ((event: Event) => void) | null) { this.originalWebSocket.onopen = handler; }
    get onclose(): ((event: CloseEvent) => void) | null { return this.originalWebSocket.onclose; }
    set onclose(handler: ((event: CloseEvent) => void) | null) { this.originalWebSocket.onclose = handler; }
    get onerror(): ((event: Event) => void) | null { return this.originalWebSocket.onerror; }
    set onerror(handler: ((event: Event) => void) | null) { this.originalWebSocket.onerror = handler; }
    
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
}

unsafeWindow.WebSocket = WebSocketProxy as any;