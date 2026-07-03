const store = new Map();
const staleStore = new Map();

export function memoryGet(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function memoryGetStale(key) {
  const entry = staleStore.get(key);
  return entry?.value ?? null;
}

export function memorySet(key, value, ttlSeconds) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  staleStore.set(key, { value, storedAt: Date.now() });
}

export function memoryDelete(key) {
  store.delete(key);
}

export function memoryDeletePrefix(prefix) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

export function memoryClear() {
  store.clear();
}
