import "@testing-library/jest-dom";
// import 'jest-canvas-mock';

// Testencoder for _document.tsx and middleware
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn((key: string) => {
    if (key === 'lang') return 'en';
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

global.localStorage = localStorageMock as any;