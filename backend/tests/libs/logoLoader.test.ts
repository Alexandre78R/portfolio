import fs from 'fs';
import path from 'path';
import { loadLogos, getMimeType, loadedLogos } from '../../src/lib/logoLoader';

jest.mock('fs');

const LOGOS_DIR = path.join(__dirname, '../../src/images/logos');

describe('logoLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    loadedLogos.clear();
  });

  describe('getMimeType', () => {
    it('returns correct MIME type for supported extensions', () => {
      expect(getMimeType('image.png')).toBe('image/png');
      expect(getMimeType('image.svg')).toBe('image/svg+xml');
      expect(getMimeType('image.jpg')).toBe('image/jpeg');
    });

    it('returns application/octet-stream for unsupported extensions', () => {
      expect(getMimeType('file.xyz')).toBe('application/octet-stream');
    });

    it('is case-insensitive when determining MIME types', () => {
      expect(getMimeType('image.PNG')).toBe('image/png');
      expect(getMimeType('image.SvG')).toBe('image/svg+xml');
      expect(getMimeType('image.JpG')).toBe('image/jpeg');
    });
  });

  describe('loadLogos', () => {
    it('loads valid logo files and adds them to the map', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['logo1.png', 'logo2.svg']);

      // Simulate file contents
      (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
        if (filePath.includes('logo1.png')) return Buffer.from('image data 1');
        if (filePath.includes('logo2.svg')) return Buffer.from('image data 2');
        throw new Error('File not found');
      });

      loadLogos();

      expect(fs.readdirSync).toHaveBeenCalledWith(LOGOS_DIR);
      expect(loadedLogos.size).toBe(2);
      expect(loadedLogos.has('logo1')).toBe(true);
      expect(loadedLogos.has('logo2')).toBe(true);
    });

    it('ignores files with unsupported extensions', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['logo1.png', 'ignore.me']);

      (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
        if (filePath.includes('logo1.png')) return Buffer.from('image data 1');
        throw new Error('File not found');
      });

      loadLogos();

      expect(loadedLogos.size).toBe(1);
      expect(loadedLogos.has('logo1')).toBe(true);
      expect(loadedLogos.has('ignore')).toBe(false);
    });

    it('handles errors when reading files without crashing', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['logo1.png', 'logo2.svg']);

      (fs.readFileSync as jest.Mock).mockImplementation((filePath) => {
        if (filePath.includes('logo1.png')) return Buffer.from('image data 1');
        throw new Error('File read error');
      });

      loadLogos();

      expect(loadedLogos.size).toBe(1);
      expect(loadedLogos.has('logo1')).toBe(true);
      expect(loadedLogos.has('logo2')).toBe(false);
    });

    it('handles errors when reading the directory without crashing', () => {
      (fs.readdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Directory read error');
      });

      loadLogos();

      expect(loadedLogos.size).toBe(0);
    });

    it('handles an empty directory without crashing', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue([]);

      loadLogos();

      expect(loadedLogos.size).toBe(0);
    });

    it('handles filenames with multiple dots correctly', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['logo.test.png']);
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('data'));

      loadLogos();

      expect(loadedLogos.size).toBe(1);
      expect(loadedLogos.has('logo.test')).toBe(true);
    });

    it('stores logos with filename as key without extension', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['sample-logo.svg']);
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('data'));

      loadLogos();

      expect(loadedLogos.has('sample-logo')).toBe(true);
    });

    it('does nothing if directory reading returns null or undefined', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(null);

      loadLogos();
      expect(loadedLogos.size).toBe(0);

      (fs.readdirSync as jest.Mock).mockReturnValue(undefined);

      loadLogos();
      expect(loadedLogos.size).toBe(0);
    });
  });
});