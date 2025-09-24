type ReadyListener = (core: Core) => void;
type StateListener = (state: State) => void;

export class CoreService {
  private _corePromise: Promise<Core> | null = null;
  private _core: Core | null = null;
  private _readyListeners: ReadyListener[] = [];
  private _stateListeners: StateListener[] = [];
  private _stateSnapshot: State | null = null;
  private _cleanupFns: (() => void)[] = [];
  private _initialized = false;

  private legacyGetCore: (() => Promise<Core>) | null = null;

  setInitializer(fn: () => Promise<Core>) {
    this.legacyGetCore = fn;
    this._corePromise = null;
    this._core = null;
    this._initialized = false;
    this._stateSnapshot = null;
  }

  private async ensureLegacyInitializer(): Promise<void> {
    if (this.legacyGetCore) return;
    try {
      const mod: any = await import("../core");
      const getter = typeof mod.getCore === "function" ? mod.getCore : typeof mod.default === "function" ? mod.default : null;
      if (getter) {
        this.legacyGetCore = getter as () => Promise<Core>;
      }
    } catch (e) {
      console.debug("coreService: dynamic import ../core failed (ok if you injected initializer)", e);
    }
  }

  async init(): Promise<Core> {
    if (this._corePromise) return this._corePromise;
    await this.ensureLegacyInitializer();

    if (!this.legacyGetCore) {
      throw new Error(
        "No core initializer available. Provide src/core with getCore() or call coreService.setInitializer()."
      );
    }

    let timeoutHandle: any = null;

    this._corePromise = (async () => {
      try {
        const core = await this.legacyGetCore!();
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
          timeoutHandle = null;
        }

        this._core = core;
        this._initialized = true;

        try {
          this._stateSnapshot = (core as Core).game?.state ?? null;
        } catch {
          this._stateSnapshot = null;
        }

        for (const l of [...this._readyListeners]) {
          try {
            l(core);
          } catch (err) {
            console.warn("coreService ready listener error", err);
          }
        }

        if (this._stateSnapshot) {
          for (const sl of [...this._stateListeners]) {
            try {
              sl(this._stateSnapshot);
            } catch (err) {
              console.warn("coreService state listener error", err);
            }
          }
        }

        return core;
      } catch (err) {
        this._corePromise = null;
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        throw err;
      }
    })();

    return this._corePromise;
  }

  getCore(): Promise<Core> {
    return this.init();
  }

  whenReady(): Promise<Core> {
    return this.getCore();
  }

  onReady(cb: ReadyListener): () => void {
    if (this._initialized && this._core) {
      setTimeout(() => {
        try {
          cb(this._core as Core);
        } catch (e) {
          console.warn("coreService onReady immediate callback error", e);
        }
      }, 0);
      return () => {};
    }
    this._readyListeners.push(cb);
    return () => {
      const idx = this._readyListeners.indexOf(cb);
      if (idx >= 0) this._readyListeners.splice(idx, 1);
    };
  }

  subscribeState(cb: StateListener): () => void {
    if (this._stateSnapshot) {
      try {
        cb(this._stateSnapshot);
      } catch (e) {
        console.warn("coreService subscribeState immediate callback error", e);
      }
    }
    this._stateListeners.push(cb);
    return () => {
      const idx = this._stateListeners.indexOf(cb);
      if (idx >= 0) this._stateListeners.splice(idx, 1);
    };
  }

  notifyStateUpdated(newState?: State) {
    if (newState) this._stateSnapshot = newState;
    else if (this._core) {
      try {
        this._stateSnapshot = (this._core as Core).game.state;
      } catch {
        this._stateSnapshot = null;
      }
    }
    if (!this._stateSnapshot) return;
    for (const sl of [...this._stateListeners]) {
      try {
        sl(this._stateSnapshot);
      } catch (e) {
        console.warn("coreService notifyStateUpdated listener error", e);
      }
    }
  }

  async getState(): Promise<State> {
    const core = await this.getCore();
    return (core as Core).game.state;
  }

  getStateSync(): State {
    if (!this._initialized || !this._core) {
      throw new Error("Core not initialized. Await coreService.whenReady() or use subscribeState().");
    }
    return (this._core as Core).game.state;
  }

  registerCleanup(fn: () => void) {
    this._cleanupFns.push(fn);
  }

  dispose() {
    for (const fn of this._cleanupFns) {
      try {
        fn();
      } catch {}
    }
    this._cleanupFns = [];
    this._stateListeners = [];
    this._readyListeners = [];
    this._corePromise = null;
    this._core = null;
    this._initialized = false;
    this._stateSnapshot = null;
  }
}

export const coreService = new CoreService();