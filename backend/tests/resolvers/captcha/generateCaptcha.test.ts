import "reflect-metadata";
import { CaptchaResolver } from "../../../src/resolvers/captcha.resolver";
import { MyContext } from "../../../src";
import { CaptchaResponse } from "../../../src/types/captcha.types";
import * as uuid from "uuid";
import * as fs from "fs";
import * as path from "path";
import { captchaImageMap, captchaMap } from "../../../src/CaptchaMap";

jest.mock("uuid", () => ({ v4: jest.fn() }));
jest.mock("fs", () => ({ readdirSync: jest.fn() }));
jest.mock("path", () => ({ join: jest.fn(), basename: jest.fn(), extname: jest.fn() }));

const createMockDirent = (name: string): fs.Dirent<NonSharedBuffer> =>
  ({
    name,
    isFile: () => true,
    isDirectory: () => false,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
  } as unknown as fs.Dirent<NonSharedBuffer>);

describe("CaptchaResolver - generateCaptcha", (): void => {
  let resolver: CaptchaResolver;

  let mockUuidV4: jest.MockedFunction<typeof uuid.v4>;
  let mockReaddirSync: jest.MockedFunction<typeof fs.readdirSync>;
  let mockPathJoin: jest.MockedFunction<typeof path.join>;
  let mockPathBasename: jest.MockedFunction<typeof path.basename>;
  let mockPathExtname: jest.MockedFunction<typeof path.extname>;

  const originalProcessEnv: NodeJS.ProcessEnv = process.env;

  beforeAll(() => {
    process.env = { ...originalProcessEnv, BASE_URL: "http://test-server:4000" };
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

    Object.keys(captchaImageMap).forEach((key: string) => delete captchaImageMap[key]);
    Object.keys(captchaMap).forEach((key: string) => delete captchaMap[key]);

    resolver = new CaptchaResolver();

    mockPathJoin.mockImplementation((...args: string[]) => args.join("/"));

    mockPathBasename.mockImplementation((file: string | fs.Dirent) => {
      const name = typeof file === "string" ? file : file.name;
      return name.split(".")[0];
    });

    mockPathExtname.mockImplementation((file: string | fs.Dirent) => {
      const name = typeof file === "string" ? file : file.name;
      return `.${name.split(".").pop()}`;
    });
  });

  it("should generate a captcha with correct structure and images", async (): Promise<void> => {
    const mockCaptchaId: string = "captcha-id-123";
    const mockImageIds: string[] = ["img-id-1","img-id-2","img-id-3","img-id-4","img-id-5","img-id-6"];

    mockUuidV4
      .mockReturnValueOnce(mockCaptchaId)
      .mockReturnValueOnce(mockImageIds[0])
      .mockReturnValueOnce(mockImageIds[1])
      .mockReturnValueOnce(mockImageIds[2])
      .mockReturnValueOnce(mockImageIds[3])
      .mockReturnValueOnce(mockImageIds[4])
      .mockReturnValueOnce(mockImageIds[5]);

    mockReaddirSync.mockReturnValueOnce([
      createMockDirent("car-voiture-1.png"),
      createMockDirent("car-voiture-2.jpeg"),
      createMockDirent("car-voiture-3.jpg"),
      createMockDirent("tree-arbre-1.png"),
      createMockDirent("tree-arbre-2.jpeg"),
      createMockDirent("tree-arbre-3.jpg"),
      createMockDirent("boat-bateau-1.png"),
      createMockDirent("boat-bateau-2.jpeg"),
      createMockDirent("boat-bateau-3.jpg"),
    ]);

    const context: MyContext = {} as MyContext;
    const result: CaptchaResponse = await resolver.generateCaptcha(context);

    expect(result.id).toBe(mockCaptchaId);
    expect(result.images).toHaveLength(6);

    result.images.forEach((img, idx) => {
      expect(img.id).toBe(mockImageIds[idx]);
      expect(img.url).toBe(`http://test-server:4000/api/dynamic-images/${mockImageIds[idx]}`);
      expect(captchaImageMap[img.id]).toBeDefined();
    });

    expect(result.challengeType).toBeDefined();
    expect(result.expirationTime).toBeGreaterThan(Date.now());
    expect(mockPathJoin).toHaveBeenCalled();
    expect(mockReaddirSync).toHaveBeenCalled();
  });

  it("should handle no images found in the directory gracefully", async (): Promise<void> => {
    const mockCaptchaId = "captcha-id-empty";

    mockUuidV4.mockReturnValueOnce(mockCaptchaId);
    mockReaddirSync.mockReturnValueOnce([]);

    const context: MyContext = {} as MyContext;
    const result: CaptchaResponse = await resolver.generateCaptcha(context);

    expect(result.images).toHaveLength(0);
    expect(result.challengeType).toBeUndefined();
    expect(result.challengeTypeTranslation).toEqual({ typeEN: undefined, typeFR: "" });
  });

  it("should generate a captcha with a single category correctly", async (): Promise<void> => {
    const mockCaptchaId = "captcha-id-single";
    const mockImageIds = ["img-s1", "img-s2"];

    mockUuidV4
      .mockReturnValueOnce(mockCaptchaId)
      .mockReturnValueOnce(mockImageIds[0])
      .mockReturnValueOnce(mockImageIds[1]);

    mockReaddirSync.mockReturnValueOnce([
      createMockDirent("car-voiture-1.png"),
      createMockDirent("car-voiture-2.jpeg"),
      createMockDirent("car-voiture-3.jpg"),
    ]);

    const context: MyContext = {} as MyContext;
    const result: CaptchaResponse = await resolver.generateCaptcha(context);

    expect(result.images).toHaveLength(2);
    expect(result.challengeType).toBe("car");
    expect(result.challengeTypeTranslation.typeFR).toBe("voiture");
  });
});