import { unsafeWindow } from "$";

const origWS = unsafeWindow.WebSocket;
export const wsProxies: WsProxy[] = [];

export class WsProxy {
    private readonly ws: WebSocket;
    private msgHandlers: ((event: MessageEvent) => void)[] = [];
    public enableMsg: boolean = true;
    public enableSend: boolean = true;
    public onmessage: (event: MessageEvent) => void = () => { };
    
    constructor(url: string, protocols?: string | string[]) {
        this.ws = new origWS(url, protocols);
        this.ws.addEventListener("message", (event: MessageEvent) => {
            if (this.enableMsg) {
                this.msgHandlers.forEach(handler => handler(event));
            }
        });
        this.addEventListener("message", (event: MessageEvent) => this.onmessage(event));
        wsProxies.push(this);
    }
    
    addEventListener(type: string, callback: (event: any) => void): void {
        if (type === "message") {
            this.msgHandlers.push(callback);
        } else {
            this.ws.addEventListener(type, callback);
        }
    }
    
    send(data: any): void {
        if (this.enableSend) {
            this.ws.send(data);
        }
    }
    
    close(): void {
        this.ws.close();
    }
    
    get url(): string { return this.ws.url; }
    get protocol(): string { return this.ws.protocol; }
    get bufferedAmount(): number { return this.ws.bufferedAmount; }
    get extensions(): string { return this.ws.extensions; }
    get binaryType(): BinaryType { return this.ws.binaryType; }
    set binaryType(type: BinaryType) { this.ws.binaryType = type; }
    get readyState(): number { return this.ws.readyState; }
    get onopen(): ((event: Event) => void) | null { return this.ws.onopen; }
    set onopen(handler: ((event: Event) => void) | null) { this.ws.onopen = handler; }
    get onclose(): ((event: CloseEvent) => void) | null { return this.ws.onclose; }
    set onclose(handler: ((event: CloseEvent) => void) | null) { this.ws.onclose = handler; }
    get onerror(): ((event: Event) => void) | null { return this.ws.onerror; }
    set onerror(handler: ((event: Event) => void) | null) { this.ws.onerror = handler; }
    
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
}

unsafeWindow.WebSocket = WsProxy as any;