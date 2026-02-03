import "reflect-metadata";
import { CaptchaResolver } from "../../../src/resolvers/captcha.resolver";
import { MyContext } from "../../../src";
import { ValidationResponse, CaptchaResponse, CaptchaImage } from "../../../src/types/captcha.types";

import * as CaptchaMapModule from "../../../src/CaptchaMap";
import { captchaImageMap, captchaMap } from "../../../src/CaptchaMap";

jest.mock("../../../src/CaptchaMap", () => ({
  ...jest.requireActual("../../../src/CaptchaMap"),
  checkExpiredCaptcha: jest.fn(),
}));

describe("CaptchaResolver - validateCaptcha", () => {
  let resolver: CaptchaResolver;
  let mockCheckExpiredCaptcha: jest.MockedFunction<typeof CaptchaMapModule.checkExpiredCaptcha>;
  const context: MyContext = {} as MyContext;

  const MOCK_CAPTCHA_ID = "test-captcha-123";
  const MOCK_CHALLENGE_TYPE = "car";

  const MOCK_CAPTCHA_DATA: CaptchaResponse = {
    id: MOCK_CAPTCHA_ID,
    images: [
      { id: "img1-id", url: "http://test/dynamic/img1", typeEN: "car", typeFR: "voiture" },
      { id: "img2-id", url: "http://test/dynamic/img2", typeEN: "tree", typeFR: "arbre" },
      { id: "img3-id", url: "http://test/dynamic/img3", typeEN: "car", typeFR: "voiture" },
      { id: "img4-id", url: "http://test/dynamic/img4", typeEN: "boat", typeFR: "bateau" },
      { id: "img5-id", url: "http://test/dynamic/img5", typeEN: "car", typeFR: "voiture" },
      { id: "img6-id", url: "http://test/dynamic/img6", typeEN: "tree", typeFR: "arbre" },
    ],
    challengeType: MOCK_CHALLENGE_TYPE,
    challengeTypeTranslation: {
      typeEN: MOCK_CHALLENGE_TYPE,
      typeFR: "voiture",
    },
    expirationTime: Date.now() + 15 * 60 * 1000,
  };

  beforeEach(() => {
    mockCheckExpiredCaptcha = jest.mocked(CaptchaMapModule.checkExpiredCaptcha);
    mockCheckExpiredCaptcha.mockClear();

    Object.keys(captchaMap).forEach((key: string) => delete captchaMap[key]);
    Object.keys(captchaImageMap).forEach((key: string) => delete captchaImageMap[key]);

    captchaMap[MOCK_CAPTCHA_ID] = { ...MOCK_CAPTCHA_DATA };

    MOCK_CAPTCHA_DATA.images.forEach((image: CaptchaImage) => {
      captchaImageMap[image.id] = `mock-src-${image.id}.png`;
    });

    resolver = new CaptchaResolver();
  });

  it("should validate captcha correctly and clear maps", async () => {
    const correctIndices: number[] = [0, 2, 4];

    const result: ValidationResponse = await resolver.validateCaptcha(
      correctIndices,
      MOCK_CHALLENGE_TYPE,
      MOCK_CAPTCHA_ID,
      context
    );

    expect(result.isValid).toBe(true);
    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
    expect(mockCheckExpiredCaptcha).toHaveBeenCalledWith(MOCK_CAPTCHA_ID);

    expect(captchaMap[MOCK_CAPTCHA_ID]).toBeUndefined();
    MOCK_CAPTCHA_DATA.images.forEach((img: CaptchaImage) => {
      expect(captchaImageMap[img.id]).toBeUndefined();
    });
  });

  it("should return isValid false for incorrect selected indices", async () => {
    const incorrectIndices: number[] = [0, 1];

    const result: ValidationResponse = await resolver.validateCaptcha(
      incorrectIndices,
      MOCK_CHALLENGE_TYPE,
      MOCK_CAPTCHA_ID,
      context
    );

    expect(result.isValid).toBe(false);
    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
    expect(captchaMap[MOCK_CAPTCHA_ID]).toBeDefined();
  });

  it("should return isValid false if the number of selected indices is incorrect", async () => {
    const partialIndices: number[] = [0, 2];

    const result: ValidationResponse = await resolver.validateCaptcha(
      partialIndices,
      MOCK_CHALLENGE_TYPE,
      MOCK_CAPTCHA_ID,
      context
    );

    expect(result.isValid).toBe(false);
    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if captcha is expired or missing", async () => {
    delete captchaMap[MOCK_CAPTCHA_ID];

    await expect(
      resolver.validateCaptcha([], MOCK_CHALLENGE_TYPE, MOCK_CAPTCHA_ID, context)
    ).rejects.toThrow("Expired captcha!");

    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if captcha images array is undefined", async () => {
    captchaMap[MOCK_CAPTCHA_ID].images = undefined as unknown as CaptchaImage[];

    await expect(
      resolver.validateCaptcha([], MOCK_CHALLENGE_TYPE, MOCK_CAPTCHA_ID, context)
    ).rejects.toThrow("Expired captcha!");

    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
  });

  it("should return isValid false if the challenge type does not match", async () => {
    const result: ValidationResponse = await resolver.validateCaptcha(
      [0, 2, 4],
      "boat",
      MOCK_CAPTCHA_ID,
      context
    );

    expect(result.isValid).toBe(false);
    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
  });
});