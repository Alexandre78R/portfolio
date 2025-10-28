import "reflect-metadata";
import * as fs from 'fs';
import * as path from 'path';
import { Response } from "../../../src/types/response.types";

jest.mock('fs', () => {
  const existsSyncMock: jest.Mock<boolean, [fs.PathLike]> = jest.fn();
  const unlinkMock: jest.Mock<Promise<void>, [fs.PathLike]> = jest.fn();

  return {
    existsSync: existsSyncMock,
    promises: {
      unlink: unlinkMock,
    },
    __existsSyncMock: existsSyncMock,
    __unlinkMock: unlinkMock,
  };
});

const { __existsSyncMock: existsSyncMock, __unlinkMock: unlinkMock } = fs as unknown as {
  __existsSyncMock: jest.Mock<boolean, [fs.PathLike]>;
  __unlinkMock: jest.Mock<Promise<void>, [fs.PathLike]>;
};

class AdminResolverMock {
  private dataFolderPath: string = path.join(__dirname, '../../../backups');

  async deleteBackupFile(fileName: string): Promise<Response> {
    if (!fileName || fileName.includes('..') || path.isAbsolute(fileName)) {
      return { code: 400, message: 'Invalid file path' };
    }

    const filePath: string = path.join(this.dataFolderPath, fileName);

    if (!fs.existsSync(filePath)) {
      return { code: 404, message: `Backup file '${fileName}' not found.` };
    }

    try {
      await fs.promises.unlink(filePath);
      return { code: 200, message: `Backup file '${fileName}' deleted successfully.` };
    } catch (err: unknown) {
      const error: Error = err instanceof Error ? err : new Error(String(err));
      console.error(`Error deleting backup file '${fileName}':`, error);
      return { code: 500, message: `Failed to delete backup file '${fileName}': ${error.message}` };
    }
  }
}

describe('AdminResolver - deleteBackupFile', () => {
  let resolver: AdminResolverMock;
  let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

  beforeEach(() => {
    resolver = new AdminResolverMock();
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should delete file successfully', async () => {
    const fileName: string = 'backup.sql';
    existsSyncMock.mockReturnValue(true);
    unlinkMock.mockResolvedValue();

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(existsSyncMock).toHaveBeenCalledWith(expect.any(String));
    expect(unlinkMock).toHaveBeenCalledWith(expect.any(String));
    expect(result.code).toBe(200);
    expect(result.message).toMatch(/deleted successfully/);
  });

  it('should reject deletion if path traversal detected', async () => {
    const fileName: string = '../evil.sql';

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(result.code).toBe(400);
    expect(result.message).toMatch(/Invalid file path/);
    expect(existsSyncMock).not.toHaveBeenCalled();
    expect(unlinkMock).not.toHaveBeenCalled();
  });

  it('should return 404 if file does not exist', async () => {
    const fileName: string = 'missing.sql';
    existsSyncMock.mockReturnValue(false);

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(existsSyncMock).toHaveBeenCalledWith(expect.any(String));
    expect(unlinkMock).not.toHaveBeenCalled();
    expect(result.code).toBe(404);
    expect(result.message).toMatch(/not found/);
  });

  it('should return 500 and log error on unlink failure', async () => {
    const fileName: string = 'fileToDelete.sql';
    const error: Error = new Error('unlink failed');

    existsSyncMock.mockReturnValue(true);
    unlinkMock.mockRejectedValue(error);

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(existsSyncMock).toHaveBeenCalledWith(expect.any(String));
    expect(unlinkMock).toHaveBeenCalledWith(expect.any(String));
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringMatching(/Error deleting backup file/), error);
    expect(result.code).toBe(500);
    expect(result.message).toMatch(/Failed to delete backup file/);
  });

  it('should reject deletion if fileName is empty', async () => {
    const fileName: string = '';

    const result: Response = await resolver.deleteBackupFile(fileName);

    expect(result.code).toBe(400);
    expect(result.message).toMatch(/Invalid file path/);
    expect(existsSyncMock).not.toHaveBeenCalled();
    expect(unlinkMock).not.toHaveBeenCalled();
  });
});