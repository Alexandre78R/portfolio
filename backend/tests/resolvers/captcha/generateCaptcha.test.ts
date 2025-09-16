import "reflect-metadata";
import { CaptchaResolver } from "../../../src/resolvers/captcha.resolver";
import { MyContext } from "../../../src";
import { CaptchaResponse } from "../../../src/types/captcha.types";
import * as uuid from "uuid";
import * as fs from "fs";
import * as path from "path";
import { captchaImageMap, captchaMap } from "../../../src/CaptchaMap";

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("fs", () => ({
  readdirSync: jest.fn(),
}));

jest.mock("path", () => ({
  join: jest.fn(),
  basename: jest.fn(),
  extname: jest.fn(),
}));

describe("CaptchaResolver - generateCaptcha", () => {
  let resolver: CaptchaResolver;

  // ✅ Mocks accessibles partout
  let mockUuidV4: jest.MockedFunction<typeof uuid.v4>;
  let mockReaddirSync: jest.MockedFunction<typeof fs.readdirSync>;
  let mockPathJoin: jest.MockedFunction<typeof path.join>;
  let mockPathBasename: jest.MockedFunction<typeof path.basename>;
  let mockPathExtname: jest.MockedFunction<typeof path.extname>;

  const originalProcessEnv: NodeJS.ProcessEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalProcessEnv,
      BASE_URL: "http://test-server:4000",
    };
  });

  afterAll(() => {
    process.env = originalProcessEnv;
  });

  beforeEach(() => {
    mockUuidV4 = jest.mocked(uuid.v4);
    mockReaddirSync = jest.mocked(fs.readdirSync);
    mockPathJoin = jest.mocked(path.join);
    mockPathBasename = jest.mocked(path.basename);
    mockPathExtname = jest.mocked(path.extname);

    Object.keys(captchaImageMap).forEach(key => delete captchaImageMap[key]);
    Object.keys(captchaMap).forEach(key => delete captchaMap[key]);

    resolver = new CaptchaResolver();

    mockPathJoin.mockImplementation((...args: string[]) => args.join("/"));

    mockPathBasename.mockImplementation((filePath: string) => {
      const parts = filePath.split("/");
      return parts[parts.length - 1].split(".")[0];
    });

    mockPathExtname.mockImplementation(
      (filePath: string) => `.${filePath.split(".").pop()}`
    );
  });

  it("should generate a captcha with correct structure and images", async () => {
    const mockCaptchaId = "captcha-id-123";
    const mockImageIds = [
      "img-id-1",
      "img-id-2",
      "img-id-3",
      "img-id-4",
      "img-id-5",
      "img-id-6",
    ];

    mockUuidV4
      .mockReturnValueOnce(mockCaptchaId)
      .mockReturnValueOnce(mockImageIds[0])
      .mockReturnValueOnce(mockImageIds[1])
      .mockReturnValueOnce(mockImageIds[2])
      .mockReturnValueOnce(mockImageIds[3])
      .mockReturnValueOnce(mockImageIds[4])
      .mockReturnValueOnce(mockImageIds[5]);

    mockReaddirSync.mockReturnValueOnce([
      "car-voiture-1.png",
      "car-voiture-2.jpeg",
      "car-voiture-3.jpg",
      "tree-arbre-1.png",
      "tree-arbre-2.jpeg",
      "tree-arbre-3.jpg",
      "boat-bateau-1.png",
      "boat-bateau-2.jpeg",
      "boat-bateau-3.jpg",
    ] as any);

    const context: MyContext = {} as MyContext;

    const result: CaptchaResponse = await resolver.generateCaptcha(context);

    expect(result.id).toBe(mockCaptchaId);
    expect(result.images).toHaveLength(6);

    result.images.forEach((img, index) => {
      expect(img.id).toBe(mockImageIds[index]);
      expect(img.url).toBe(
        `http://test-server:4000/api/dynamic-images/${mockImageIds[index]}`
      );
      expect(captchaImageMap[img.id]).toBeDefined();
    });

    expect(result.challengeType).toBeDefined();
    expect(result.expirationTime).toBeGreaterThan(Date.now());

    expect(mockPathJoin).toHaveBeenCalled();
    expect(mockReaddirSync).toHaveBeenCalled();
  });

  it("should handle no images found in the directory gracefully", async () => {
    const mockCaptchaId = "captcha-id-empty";

    mockUuidV4.mockReturnValueOnce(mockCaptchaId);
    mockReaddirSync.mockReturnValueOnce([] as any);

    const context: MyContext = {} as MyContext;

    const result = await resolver.generateCaptcha(context);

    expect(result.images).toHaveLength(0);
    expect(result.challengeType).toBeUndefined();
    expect(result.challengeTypeTranslation).toEqual({
      typeEN: undefined,
      typeFR: "",
    });
  });

  it("should generate a captcha with a single category correctly", async () => {
    const mockCaptchaId = "captcha-id-single";
    const mockImageIds = ["img-s1", "img-s2"];

    mockUuidV4
      .mockReturnValueOnce(mockCaptchaId)
      .mockReturnValueOnce(mockImageIds[0])
      .mockReturnValueOnce(mockImageIds[1]);

    mockReaddirSync.mockReturnValueOnce([
      "car-voiture-1.png",
      "car-voiture-2.jpeg",
      "car-voiture-3.jpg",
    ] as any);

    const context: MyContext = {} as MyContext;

    const result = await resolver.generateCaptcha(context);

    expect(result.images).toHaveLength(2);
    expect(result.challengeType).toBe("car");
    expect(result.challengeTypeTranslation.typeFR).toBe("voiture");
  });
});