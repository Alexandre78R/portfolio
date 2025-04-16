import "reflect-metadata";
import { CaptchaResolver } from "../../../src/resolvers/captcha.resolver";
import { MyContext } from "../../../src";
import { ValidationResponse, CaptchaResponse } from "../../../src/types/captcha.types";

import * as CaptchaMapModule from '../../../src/CaptchaMap';
import { captchaImageMap, captchaMap } from '../../../src/CaptchaMap'; 

// Mock checkExpiredCaptcha
jest.mock('../../../src/CaptchaMap', () => ({
  ...jest.requireActual('../../../src/CaptchaMap'), 
  checkExpiredCaptcha: jest.fn(),
}));

describe("CaptchaResolver - validateCaptcha", () => {
  let resolver: CaptchaResolver;
  let mockCheckExpiredCaptcha: jest.Mock;

  const context: MyContext = {} as MyContext; 

  const MOCK_CAPTCHA_ID = "test-captcha-123";
  const MOCK_CHALLENGE_TYPE = "car";
  const MOCK_CAPTCHA_DATA: CaptchaResponse = {
    id: MOCK_CAPTCHA_ID,
    images: [
      { id: "img1-id", url: "http://test-server:4000/dynamic-images/img1-id", typeEN: "car", typeFR: "voiture" },
      { id: "img2-id", url: "http://test-server:4000/dynamic-images/img2-id", typeEN: "tree", typeFR: "arbre" },
      { id: "img3-id", url: "http://test-server:4000/dynamic-images/img3-id", typeEN: "car", typeFR: "voiture" },
      { id: "img4-id", url: "http://test-server:4000/dynamic-images/img4-id", typeEN: "boat", typeFR: "bateau" },
      { id: "img5-id", url: "http://test-server:4000/dynamic-images/img5-id", typeEN: "car", typeFR: "voiture" },
      { id: "img6-id", url: "http://test-server:4000/dynamic-images/img6-id", typeEN: "tree", typeFR: "arbre" },
    ],
    challengeType: MOCK_CHALLENGE_TYPE,
    challengeTypeTranslation: { typeEN: MOCK_CHALLENGE_TYPE, typeFR: "voiture" },
    expirationTime: Date.now() + 15 * 60 * 1000,
  };

  beforeEach(() => {

    mockCheckExpiredCaptcha = CaptchaMapModule.checkExpiredCaptcha as jest.Mock;
    mockCheckExpiredCaptcha.mockClear();

    for (const key in captchaImageMap) {
      delete captchaImageMap[key];
    }
    for (const key in captchaMap) {
      delete captchaMap[key];
    }

    captchaMap[MOCK_CAPTCHA_ID] = { ...MOCK_CAPTCHA_DATA };
    MOCK_CAPTCHA_DATA.images.forEach(img => {
      captchaImageMap[img.id] = `dummy-src-for-${img.id}.png`;
    });

    resolver = new CaptchaResolver();
  });

  it("should return isValid: true and clear maps for a correct captcha validation", async () => {
    const correctIndices = [0, 2, 4]; // Indices of 'car' images

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
    expect(captchaImageMap["img1-id"]).toBeUndefined();
    expect(captchaImageMap["img2-id"]).toBeUndefined();
    expect(captchaImageMap["img3-id"]).toBeUndefined();
    expect(captchaImageMap["img4-id"]).toBeUndefined();
    expect(captchaImageMap["img5-id"]).toBeUndefined();
    expect(captchaImageMap["img6-id"]).toBeUndefined();
  });

  it("should return isValid: false for incorrect selected indices", async () => {
    const incorrectIndices = [0, 1];

    const result: ValidationResponse = await resolver.validateCaptcha(
      incorrectIndices,
      MOCK_CHALLENGE_TYPE,
      MOCK_CAPTCHA_ID,
      context
    );

    expect(result.isValid).toBe(false);
    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);

    expect(captchaMap[MOCK_CAPTCHA_ID]).toBeDefined();
    expect(captchaImageMap["img1-id"]).toBeDefined();
    expect(captchaImageMap["img2-id"]).toBeDefined();
  });

  it("should return isValid: false if selected indices count does not match correct count", async () => {
    const partialIndices = [0, 2]; // Only 2 selected, but there are 3 correct 'car' images

    const result: ValidationResponse = await resolver.validateCaptcha(
      partialIndices,
      MOCK_CHALLENGE_TYPE,
      MOCK_CAPTCHA_ID,
      context
    );

    expect(result.isValid).toBe(false);
    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
    expect(captchaMap[MOCK_CAPTCHA_ID]).toBeDefined();
  });

  it("should throw an error if captchaId is not found in captchaMap after checkExpiredCaptcha", async () => {
    delete captchaMap[MOCK_CAPTCHA_ID];

    await expect(
      resolver.validateCaptcha([], MOCK_CHALLENGE_TYPE, MOCK_CAPTCHA_ID, context)
    ).rejects.toThrow("Expired captcha!");

    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if images array is null/undefined for the captcha", async () => {
    captchaMap[MOCK_CAPTCHA_ID].images = undefined as any; 

    await expect(
      resolver.validateCaptcha([], MOCK_CHALLENGE_TYPE, MOCK_CAPTCHA_ID, context)
    ).rejects.toThrow("Expired captcha!");

    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
  });

  it("should return isValid: false if challenge type is incorrect", async () => {
    const correctIndicesForCar = [0, 2, 4];
    const wrongChallengeType = "boat";

    const result: ValidationResponse = await resolver.validateCaptcha(
      correctIndicesForCar,
      wrongChallengeType,
      MOCK_CAPTCHA_ID,
      context
    );

    expect(result.isValid).toBe(false);
    expect(mockCheckExpiredCaptcha).toHaveBeenCalledTimes(1);
    expect(captchaMap[MOCK_CAPTCHA_ID]).toBeDefined();
  });
});