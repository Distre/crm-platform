import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock fetch API
const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: 'http://localhost',
    json: () => Promise.resolve([]),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
    bodyUsed: false,
    body: null,
    clone: function() { return this as Response },
  } as Response)
);

beforeAll(() => {
  // Setup global fetch mock
  global.fetch = mockFetch;
});

afterEach(() => {
  // Clear mock data between tests
  vi.clearAllMocks();
});

afterAll(() => {
  // Cleanup mocks
  vi.restoreAllMocks();
});
