import "reflect-metadata";
import { CaptchaResolver } from "../../../src/resolvers/captcha.resolver";
import { MyContext } from "../../../src";
import { captchaMap } from '../../../src/CaptchaMap';

describe("CaptchaResolver - clearCaptcha", () => {
  let resolver: CaptchaResolver;

  const context: MyContext = {} as MyContext; 

  const MOCK_CAPTCHA_ID_EXISTS = "test-captcha-to-clear-123";
  const MOCK_CAPTCHA_ID_NON_EXISTENT = "non-existent-captcha-456";

  const MOCK_CAPTCHA_DATA = { 
    id: MOCK_CAPTCHA_ID_EXISTS,
    images: [],
    challengeType: "test",
    challengeTypeTranslation: { typeEN: "test", typeFR: "test" },
    expirationTime: Date.now() + 60000,
  };

  beforeEach(() => {
    for (const key in captchaMap) {
      delete captchaMap[key];
    }
    resolver = new CaptchaResolver();
  });

  it("should return true and delete the captcha if it exists in the map", async () => {
    captchaMap[MOCK_CAPTCHA_ID_EXISTS] = MOCK_CAPTCHA_DATA;

    const result = await resolver.clearCaptcha(MOCK_CAPTCHA_ID_EXISTS, context);

    expect(result).toBe(true);
    expect(captchaMap[MOCK_CAPTCHA_ID_EXISTS]).toBeUndefined();
  });

  it("should return true if the captcha does not exist in the map", async () => {
    expect(captchaMap[MOCK_CAPTCHA_ID_NON_EXISTENT]).toBeUndefined();

    const result = await resolver.clearCaptcha(MOCK_CAPTCHA_ID_NON_EXISTENT, context);

    expect(result).toBe(true);
    expect(captchaMap[MOCK_CAPTCHA_ID_NON_EXISTENT]).toBeUndefined();
  });
});