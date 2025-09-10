import "reflect-metadata";
import * as fs from 'fs';
import * as path from 'path';

// Mock fs dès le départ
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  promises: {
    unlink: jest.fn(),
  },
}));

class AdminResolverMock {
  private dataFolderPath = path.join(__dirname, '../../../backups'); // mock path

  async deleteBackupFile(fileName: string) {
    if (!fileName || fileName.includes('..') || path.isAbsolute(fileName)) {
      return { code: 400, message: 'Invalid file path' };
    }

    const filePath = path.join(this.dataFolderPath, fileName);

    if (!fs.existsSync(filePath)) {
      return { code: 404, message: `Backup file '${fileName}' not found.` };
    }

    try {
      await fs.promises.unlink(filePath);
      return { code: 200, message: `Backup file '${fileName}' deleted successfully.` };
    } catch (err: any) {
      console.error(`Error deleting backup file '${fileName}':`, err);
      return { code: 500, message: `Failed to delete backup file '${fileName}': ${err.message}` };
    }
  }
}

describe('AdminResolver - deleteBackupFile', () => {
  let resolver: AdminResolverMock;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    resolver = new AdminResolverMock();
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should delete file successfully', async () => {
    const fileName = 'backup.sql';
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.unlink as jest.Mock).mockResolvedValue(undefined);

    const result = await resolver.deleteBackupFile(fileName);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.promises.unlink).toHaveBeenCalled();
    expect(result.code).toBe(200);
    expect(result.message).toMatch(/deleted successfully/);
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
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const result = await resolver.deleteBackupFile(fileName);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.promises.unlink).not.toHaveBeenCalled();
    expect(result.code).toBe(404);
    expect(result.message).toMatch(/not found/);
  });

  it('should return 500 and log error on unlink failure', async () => {
    const fileName = 'fileToDelete.sql';
    const error = new Error('unlink failed');

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.promises.unlink as jest.Mock).mockRejectedValue(error);

    const result = await resolver.deleteBackupFile(fileName);

    expect(fs.existsSync).toHaveBeenCalled();
    expect(fs.promises.unlink).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringMatching(/Error deleting backup file/), error);

    expect(result.code).toBe(500);
    expect(result.message).toMatch(/Failed to delete backup file/);
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