import "reflect-metadata";
import * as path from 'path';

// Mock fs dès le début, avant import resolver
jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
    promises: {
      unlink: jest.fn(),
    },
  };
});

import * as fs from 'fs';
import { AdminResolver, dataFolderPath } from '../../../src/resolvers/admin.resolver';

describe('AdminResolver - deleteBackupFile', () => {
  let resolver: AdminResolver;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    resolver = new AdminResolver();
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should delete file successfully', async () => {
    const fileName = 'backup.sql';
    const filePath = path.join(dataFolderPath, fileName);

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);

    const result = await resolver.deleteBackupFile(fileName);

    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.promises.unlink).toHaveBeenCalledWith(filePath);

    expect(result.code).toBe(200);
    expect(result.message).toBe(`Backup file '${fileName}' deleted successfully.`);
  });

  it('should reject deletion if path traversal detected', async () => {
    const fileName = '../evil.sql';

    const result = await resolver.deleteBackupFile(fileName);

    expect(result.code).toBe(400);
    expect(result.message).toMatch(/Invalid file path/);
    expect(fs.existsSync).not.toHaveBeenCalled();
    expect(fs.promises.unlink).not.toHaveBeenCalled();
  });

  it('should return 404 if file does not exist', async () => {
    const fileName = 'missing.sql';
    const filePath = path.join(dataFolderPath, fileName);

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = await resolver.deleteBackupFile(fileName);

    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.promises.unlink).not.toHaveBeenCalled();

    expect(result.code).toBe(404);
    expect(result.message).toBe(`Backup file '${fileName}' not found.`);
  });

  it('should return 500 and log error on unlink failure', async () => {
    const fileName = 'fileToDelete.sql';
    const filePath = path.join(dataFolderPath, fileName);
    const error = new Error('unlink failed');

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.unlink as jest.Mock).mockRejectedValue(error);

    const result = await resolver.deleteBackupFile(fileName);

    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.promises.unlink).toHaveBeenCalledWith(filePath);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Error deleting backup file '${fileName}':`, error);

    expect(result.code).toBe(500);
    expect(result.message).toBe(`Failed to delete backup file '${fileName}': unlink failed`);
  });

    it('should reject deletion if fileName is empty', async () => {
    const fileName = '';

    const result = await resolver.deleteBackupFile(fileName);

    expect(result.code).toBe(400);
    expect(result.message).toMatch(/Invalid file path/);
    expect(fs.existsSync).not.toHaveBeenCalled();
    expect(fs.promises.unlink).not.toHaveBeenCalled();
  });

});