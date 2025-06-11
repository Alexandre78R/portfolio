import request from 'supertest';
import express, { Errback, Response } from 'express';

// Mock propre de path
jest.mock('path', () => {
  const actualPath = jest.requireActual('path');
  return {
    ...actualPath,
    join: jest.fn(),
  };
});
import path from 'path';

const app = express();

app.get('/upload/:type/:filename', (req, res) => {
  const { type, filename } = req.params;

  if (!['image', 'video'].includes(type)) {
    return res.status(400).send('Invalid type. Use "image" or "video".');
  }

  const filePath = path.join(__dirname, '.', 'uploads', `${type}s`, filename);

  res.sendFile(filePath, (err) => {
    if (err && !res.headersSent) {
      // The console.error here is fine, it only logs on actual error
      console.error(`Fichier non trouvé : ${filePath}`);
      return res.status(404).send('Fichier non trouvé');
    }
  });
});

describe('GET /upload/:type/:filename', () => {
  const mockJoin = path.join as jest.Mock;
  let sendFileSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on sendFile
    sendFileSpy = jest
      .spyOn(express.response, 'sendFile')
      .mockImplementation(function (
        this: Response,
        filePath: string,
        optionsOrCb?: any,
        cb?: Errback
      ) {
        const callback: Errback | undefined =
          typeof optionsOrCb === 'function' ? optionsOrCb : cb;

        // Simulate async call
        setImmediate(() => {
          if (filePath.includes('missing')) {
            // On error, call the callback with an error
            callback?.(new Error('Not found'));
          } else {
            callback?.(null as any);
            if (!this.headersSent) {
              this.status(200).send('Mock file content from sendFile mock');
            }
          }
        });

        return this;
      });
  });

  afterEach(() => {
    if (sendFileSpy) sendFileSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should return 400 if type is invalid', async () => {
    const res = await request(app).get('/upload/invalid/file.png');
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('Invalid type. Use "image" or "video".');
  });

  it('should return 200 and call sendFile when file exists', async () => {
    const filePath = '/mock/path/uploads/images/file.png';
    mockJoin.mockReturnValueOnce(filePath);

    const res = await request(app).get('/upload/image/file.png');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Mock file content from sendFile mock');
    expect(sendFileSpy).toHaveBeenCalledWith(filePath, expect.any(Function));
  });

  it('should return 404 if file does not exist', async () => {
    const filePath = '/mock/path/uploads/images/missing.png';
    mockJoin.mockReturnValueOnce(filePath);

    const res = await request(app).get('/upload/image/missing.png');

    expect(res.statusCode).toBe(404);
    expect(res.text).toBe('Fichier non trouvé');
    expect(sendFileSpy).toHaveBeenCalledWith(filePath, expect.any(Function));
  });
});