import "reflect-metadata";
import * as fs from 'fs';
import { AdminResolver } from '../../../src/resolvers/admin.resolver';

// Spy uniquement sur fs.promises
jest.spyOn(fs.promises, 'readdir').mockImplementation(jest.fn());
jest.spyOn(fs.promises, 'stat').mockImplementation(jest.fn());

describe('AdminResolver - listBackupFiles', () => {
  let resolver: AdminResolver;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    resolver = new AdminResolver();

    (fs.promises.readdir as jest.Mock).mockReset();
    (fs.promises.stat as jest.Mock).mockReset();

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test('should return empty files if data folder does not exist', async () => {
    const enoentError = new Error('not found') as any;
    enoentError.code = 'ENOENT';

    (fs.promises.readdir as jest.Mock).mockRejectedValue(enoentError);

    const result = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.files).toEqual([]);
  });

  test('should list backup files with their stats', async () => {
    (fs.promises.readdir as jest.Mock).mockResolvedValue(['file1.sql', 'file2.sql']);
    (fs.promises.stat as jest.Mock).mockResolvedValue({
      size: 1234,
      mtime: new Date('2025-06-10T10:00:00Z'),
      isFile: () => true,
    });

    const result = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.message).toMatch(/Backup files listed successfully/);
    expect(result.files).toHaveLength(2);
    expect(result.files![0].fileName).toBe('file1.sql');
  });

  test('should continue if stat fails for a file and log warning', async () => {
    (fs.promises.readdir as jest.Mock).mockResolvedValue(['goodfile.sql', 'badfile.sql']);
    (fs.promises.stat as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          size: 5678,
          mtime: new Date('2025-06-11T12:00:00Z'),
          isFile: () => true,
        })
      )
      .mockImplementationOnce(() => Promise.reject(new Error('stat error')));

    const result = await resolver.listBackupFiles();

    expect(result.code).toBe(200);
    expect(result.files).toHaveLength(1);
    expect(result.files![0].fileName).toBe('goodfile.sql');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Could not get stats for file badfile.sql:'),
      expect.any(Error)
    );
  });

  test('should return 500 error if readdir throws unexpected error', async () => {
    (fs.promises.readdir as jest.Mock).mockRejectedValue(new Error('readdir error'));

    const result = await resolver.listBackupFiles();

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/readdir error/);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error listing backup files:', expect.any(Error));
  });
});