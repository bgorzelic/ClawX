/**
 * Vitest Test Setup
 * Global test configuration and mocks
 */
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock window.electron API
const mockElectron = {
  ipcRenderer: {
    invoke: vi.fn(),
    on: vi.fn(),
    once: vi.fn(),
    off: vi.fn(),
  },
  openExternal: vi.fn(),
  platform: 'darwin',
  isDev: true,
};

Object.defineProperty(window, 'electron', {
  value: mockElectron,
  writable: true,
});

// Node >= 25 defines its own global localStorage, which is undefined unless
// --localstorage-file is passed, and it shadows jsdom's. zustand's persist
// middleware then has no storage and every setState throws. Use jsdom's.
if (typeof globalThis.localStorage?.setItem !== 'function') {
  const { jsdom } = globalThis as unknown as { jsdom: { window: Window } };
  for (const key of ['localStorage', 'sessionStorage'] as const) {
    Object.defineProperty(globalThis, key, {
      value: jsdom.window[key],
      configurable: true,
      writable: true,
    });
  }
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
