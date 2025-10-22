import "@testing-library/jest-dom";
// import 'jest-canvas-mock';

// Testencoder for _document.tsx
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;