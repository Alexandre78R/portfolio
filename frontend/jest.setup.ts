import "@testing-library/jest-dom";
// import 'jest-canvas-mock';

// Testencoder for _document.tsx and middleware
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;