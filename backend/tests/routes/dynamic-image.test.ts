import request from 'supertest';
import express from 'express';
import * as path from 'path';
import { captchaImageMap } from '../../src/CaptchaMap';

// ✅ Mock partiel de 'path' : on garde les vraies fonctions sauf 'join'
jest.mock('path', () => {
  const actualPath = jest.requireActual('path');
  return {
    ...actualPath,
    join: jest.fn(), // Mock seulement join
  };
});

// ✅ Mock de captchaImageMap pour test contrôlé
jest.mock('../../src/CaptchaMap', () => ({
  captchaImageMap: {}, 
}));

const app = express();

app.get('/dynamic-images/:id', (req, res) => {
  const imageId = req.params.id;
  const filename = captchaImageMap[imageId];
  if (filename) {
    const imagePath = path.join(__dirname, 'images', filename);
    res.status(200).send(`Mock image content for ${filename}`);
  } else {
    res.status(404).send('Image not found');
  }
});

describe('GET /dynamic-images/:id', () => {
  let mockPathJoin: jest.Mock;

  beforeEach(() => {
    mockPathJoin = path.join as jest.Mock;
    mockPathJoin.mockClear();

    for (const key in captchaImageMap) {
      delete captchaImageMap[key];
    }
  });

  it('should return 200 and image content if imageId is found', async () => {
    const testImageId = 'valid-img-id';
    const testFilename = 'test-image.png';
    captchaImageMap[testImageId] = testFilename;

    mockPathJoin.mockReturnValueOnce(`/mock/path/to/images/${testFilename}`);

    const response = await request(app).get(`/dynamic-images/${testImageId}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`Mock image content for ${testFilename}`);
    expect(mockPathJoin).toHaveBeenCalledWith(expect.any(String), 'images', testFilename);
  });

  it('should return 404 if imageId is not found', async () => {
    const testImageId = 'non-existent-img-id';

    const response = await request(app).get(`/dynamic-images/${testImageId}`);

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe('Image not found');
    expect(mockPathJoin).not.toHaveBeenCalled();
  });
});