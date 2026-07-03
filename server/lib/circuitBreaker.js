let failures = 0;
let openedAt = null;

export function recordFailure(config) {
  failures += 1;
  if (failures >= config.circuitBreaker.failureThreshold && !openedAt) {
    openedAt = Date.now();
  }
}

export function recordSuccess() {
  failures = 0;
  openedAt = null;
}

export function isCircuitOpen(config) {
  if (!openedAt) return false;
  if (Date.now() - openedAt > config.circuitBreaker.resetAfterMs) {
    failures = 0;
    openedAt = null;
    return false;
  }
  return true;
}

export function resetCircuit() {
  failures = 0;
  openedAt = null;
}
