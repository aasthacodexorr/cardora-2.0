/**
 * aiChatStorage.ts
 *
 * Client-side IndexedDB persistence for AI Search chat messages.
 * Stores ONLY { id, role, text } — no vehicle results, filters, or API data.
 *
 * Safe to import in client components; must NOT be imported at the module
 * level in any file that runs during Next.js SSR (use dynamic import or
 * guard with typeof window !== "undefined").
 */

const DB_NAME = "cardora-ai-chat";
const DB_VERSION = 1;
const STORE_NAME = "messages";

/** The shape we persist (includes optional resultsSnapshot for AI messages). */
export type PersistedMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  resultsSnapshot?: {
    results: any[];
    filters: any;
    total: number;
    page: number;
    hasMore: boolean;
  };
};

// ─── Internal helpers ────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // keyPath "id" — each message is keyed by its own id string.
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Persist the full current message list.
 * Overwrites whatever was stored before (clear + add all).
 * Silently no-ops if IndexedDB is unavailable (SSR guard).
 */
export async function saveMessages(messages: PersistedMessage[]): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    // Clear old messages, then write the new set.
    store.clear();
    for (const msg of messages) {
      store.put({
        id: msg.id,
        role: msg.role,
        text: msg.text,
        ...(msg.resultsSnapshot ? { resultsSnapshot: msg.resultsSnapshot } : {}),
      });
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    db.close();
  } catch {
    // Non-fatal — chat still works without persistence.
  }
}

/**
 * Load previously saved messages.
 * Returns an empty array when nothing is stored or IndexedDB is unavailable.
 */
export async function loadMessages(): Promise<PersistedMessage[]> {
  if (typeof window === "undefined" || !window.indexedDB) return [];

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const messages = await new Promise<PersistedMessage[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as PersistedMessage[]);
      request.onerror = () => reject(request.error);
    });

    db.close();
    return messages;
  } catch {
    return [];
  }
}

/**
 * Wipe all stored messages (e.g. when the user resets the chat).
 * Silently no-ops if IndexedDB is unavailable.
 */
export async function clearMessages(): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;

  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Non-fatal.
  }
}
