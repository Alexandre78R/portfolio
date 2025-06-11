import "reflect-metadata";
import { CaptchaResolver } from "../../../src/resolvers/captcha.resolver";
import { MyContext } from "../../../src";
import { CaptchaResponse } from "../../../src/types/captcha.types";
import * as uuid from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { captchaImageMap, captchaMap } from '../../../src/CaptchaMap';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('fs', () => ({
  readdirSync: jest.fn(),
}));
jest.mock('path', () => ({
  join: jest.fn(),
  basename: jest.fn(),
  extname: jest.fn(),
}));

describe("CaptchaResolver - generateCaptcha", () => {
  let resolver: CaptchaResolver;
  let mockUuidV4: jest.Mock;
  let mockReaddirSync: jest.Mock;
  let mockPathJoin: jest.Mock;
  let mockPathBasename: jest.Mock;
  let mockPathExtname: jest.Mock;

  const originalProcessEnv = process.env;

  beforeAll(() => {
    // Store original process.env and set mock BASE_URL
    process.env = { ...originalProcessEnv, BASE_URL: 'http://test-server:4000' };
  });

  afterAll(() => {
    process.env = originalProcessEnv;
  });

  beforeEach(() => {
    mockUuidV4 = uuid.v4 as jest.Mock;
    mockReaddirSync = fs.readdirSync as jest.Mock;
    mockPathJoin = path.join as jest.Mock;
    mockPathBasename = path.basename as jest.Mock;
    mockPathExtname = path.extname as jest.Mock;

    for (const key in captchaImageMap) {
      delete captchaImageMap[key];
    }
    for (const key in captchaMap) {
      delete captchaMap[key];
    }

    resolver = new CaptchaResolver();

    mockPathJoin.mockImplementation((...args: string[]) => args.join('/'));
    mockPathBasename.mockImplementation((filePath: string) => {
      const parts = filePath.split('/');
      return parts[parts.length - 1].split('.')[0];
    });
    mockPathExtname.mockImplementation((filePath: string) => `.${filePath.split('.').pop()}`);
  });

  it("should generate a captcha with correct structure and images", async () => {
    const mockCaptchaId = "captcha-id-123";
    const mockImageIds = ["img-id-1", "img-id-2", "img-id-3", "img-id-4", "img-id-5", "img-id-6"];

    // Mock uuidv4 calls
    mockUuidV4
      .mockReturnValueOnce(mockCaptchaId)
      .mockReturnValueOnce(mockImageIds[0])
      .mockReturnValueOnce(mockImageIds[1])
      .mockReturnValueOnce(mockImageIds[2])
      .mockReturnValueOnce(mockImageIds[3])
      .mockReturnValueOnce(mockImageIds[4])
      .mockReturnValueOnce(mockImageIds[5]);

    // Mock fs.readdirSync to return a set of image files
    mockReaddirSync.mockReturnValueOnce([
      "car-voiture-1.png", "car-voiture-2.jpeg", "car-voiture-3.jpg",
      "tree-arbre-1.png", "tree-arbre-2.jpeg", "tree-arbre-3.jpg",
      "boat-bateau-1.png", "boat-bateau-2.jpeg", "boat-bateau-3.jpg",
    ]);

    const context: MyContext = {} as MyContext;

    const result: CaptchaResponse = await resolver.generateCaptcha(context);

    expect(result).toBeDefined();
    expect(result.id).toBe(mockCaptchaId);
    expect(result.images).toHaveLength(6); // 3 categories * 2 images each

    result.images.forEach((img, index) => {
      expect(img.id).toBe(mockImageIds[index]);
      expect(img.url).toMatch(`http://test-server:4000/dynamic-images/${mockImageIds[index]}`);
      expect(img.typeEN).toBeDefined();
      expect(img.typeFR).toBeDefined();
      expect(captchaImageMap[img.id]).toBeDefined();
    });

    expect(result.challengeType).toBeDefined();
    expect(result.challengeTypeTranslation.typeEN).toBe(result.challengeType);
    expect(result.challengeTypeTranslation.typeFR).toBeDefined();
    expect(result.expirationTime).toBeGreaterThan(Date.now());

    expect(captchaMap[mockCaptchaId]).toEqual(
      expect.objectContaining({
        id: mockCaptchaId,
        images: expect.arrayContaining(result.images),
        challengeType: result.challengeType,
        challengeTypeTranslation: result.challengeTypeTranslation,
        expirationTime: expect.any(Number),
      })
    );

    expect(mockPathJoin).toHaveBeenCalledWith(expect.any(String), '..', 'images');
    expect(mockReaddirSync).toHaveBeenCalledWith(expect.any(String));
  });

  it("should handle no images found in the directory gracefully", async () => {
    const mockCaptchaId = "captcha-id-empty";
    mockUuidV4.mockReturnValueOnce(mockCaptchaId);
    mockReaddirSync.mockReturnValueOnce([]);

    const context: MyContext = {} as MyContext;
    const result: CaptchaResponse = await resolver.generateCaptcha(context);

    expect(result).toBeDefined();
    expect(result.id).toBe(mockCaptchaId);
    expect(result.images).toHaveLength(0);
    expect(result.challengeType).toBeUndefined();
    expect(result.challengeTypeTranslation).toEqual({ typeEN: undefined, typeFR: '' });
    expect(result.expirationTime).toBeGreaterThan(Date.now());

    expect(captchaMap[mockCaptchaId]).toEqual(
      expect.objectContaining({
        id: mockCaptchaId,
        images: [],
        challengeType: undefined,
        challengeTypeTranslation: { typeEN: undefined, typeFR: '' },
        expirationTime: expect.any(Number),
      })
    );
  });

  it("should generate a captcha with a single category correctly", async () => {
    const mockCaptchaId = "captcha-id-single";
    const mockImageIds = ["img-s1", "img-s2"];
    mockUuidV4
      .mockReturnValueOnce(mockCaptchaId)
      .mockReturnValueOnce(mockImageIds[0])
      .mockReturnValueOnce(mockImageIds[1]);

    mockReaddirSync.mockReturnValueOnce([
      "car-voiture-1.png", "car-voiture-2.jpeg", "car-voiture-3.jpg",
    ]);

    const context: MyContext = {} as MyContext;
    const result: CaptchaResponse = await resolver.generateCaptcha(context);

    expect(result).toBeDefined();
    expect(result.id).toBe(mockCaptchaId);
    expect(result.images).toHaveLength(2);
    expect(result.images[0].typeEN).toBe("car");
    expect(result.images[1].typeEN).toBe("car");
    expect(result.challengeType).toBe("car");
    expect(result.challengeTypeTranslation.typeEN).toBe("car");
    expect(result.challengeTypeTranslation.typeFR).toBe("voiture");
  });
});