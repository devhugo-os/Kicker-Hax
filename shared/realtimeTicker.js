/**
 * Creates a stable simulation clock. Browsers aggressively clamp timers from
 * hidden tabs, so the P2P host uses a dedicated worker while Node keeps the
 * normal interval fallback.
 */
export function createRealtimeTicker(onTick, intervalMs = 1000 / 60, runtime = globalThis) {
  let stopped = false;
  let intervalId = null;
  let worker = null;

  const startFallback = () => {
    if (stopped || intervalId !== null) return;
    intervalId = runtime.setInterval(() => onTick(runtime.Date?.now?.() || Date.now()), intervalMs);
  };

  const canUseWorker = typeof runtime.Worker === 'function'
    && typeof runtime.Blob === 'function'
    && typeof runtime.URL?.createObjectURL === 'function';

  if (canUseWorker) {
    try {
      const source = `
        let timer = null;
        let waitingForMain = false;
        self.onmessage = ({ data }) => {
          if (data?.type === 'ack') {
            waitingForMain = false;
            return;
          }
          clearInterval(timer);
          const delay = Math.max(4, Number(data.intervalMs) || 16.6667);
          timer = setInterval(() => {
            if (waitingForMain) return;
            waitingForMain = true;
            self.postMessage(1);
          }, delay);
        };
      `;
      const workerUrl = runtime.URL.createObjectURL(new runtime.Blob([source], { type: 'text/javascript' }));
      worker = new runtime.Worker(workerUrl);
      runtime.URL.revokeObjectURL?.(workerUrl);
      worker.onmessage = event => {
        if (stopped) return;
        try {
          onTick(runtime.Date?.now?.() || Date.now());
        } finally {
          worker?.postMessage({ type: 'ack' });
        }
      };
      worker.onerror = () => {
        worker?.terminate();
        worker = null;
        startFallback();
      };
      worker.postMessage({ intervalMs });
    } catch {
      worker = null;
      startFallback();
    }
  } else {
    startFallback();
  }

  return {
    stop() {
      if (stopped) return;
      stopped = true;
      worker?.terminate();
      worker = null;
      if (intervalId !== null) runtime.clearInterval(intervalId);
      intervalId = null;
    }
  };
}
