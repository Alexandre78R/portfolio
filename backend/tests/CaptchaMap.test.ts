import { jest } from "@jest/globals";
import {
  captchaMap,
  captchaImageMap,
  cleanUpExpiredCaptchas,
  checkExpiredCaptcha,
} from "../src/CaptchaMap";

// Type strict pour les images dans captchaMap
interface MockImage {
  id: string;
  value: string;
}

// Type strict pour un captcha
interface MockCaptcha {
  id: string;
  images: MockImage[];
  challengeType: string;
  expirationTime: number;
}

describe("Captcha Manager Utilities", (): void => {
  let mockCaptchaId: string;
  let mockImages: MockImage[];
  let mockCaptcha: MockCaptcha;
  let consoleSpy: ReturnType<typeof jest.spyOn>;

  // Reset maps et initialisation des mocks avant chaque test
  beforeEach((): void => {
    // Reset captchaMap
    Object.keys(captchaMap).forEach((key: string): void => {
      delete captchaMap[key];
    });

    // Reset captchaImageMap
    Object.keys(captchaImageMap).forEach((key: string): void => {
      delete captchaImageMap[key];
    });

    // Initialisation mocks
    mockCaptchaId = "captcha-123";

    mockImages = [
      { id: "img-1", value: "image1" },
      { id: "img-2", value: "image2" },
    ];

    mockCaptcha = {
      id: mockCaptchaId,
      images: mockImages,
      challengeType: "image",
      expirationTime: Date.now() + 60_000, // expires in 1 minute
    };

    // Remplissage des maps
    captchaMap[mockCaptchaId] = mockCaptcha;
    mockImages.forEach((image: MockImage): void => {
      captchaImageMap[image.id] = image.value;
    });

    // Préparer le spy console pour certains tests
    consoleSpy = jest.spyOn(console, "log").mockImplementation((): void => {});
  });

  // Nettoyage du spy après chaque test
  afterEach((): void => {
    consoleSpy.mockRestore();
  });

  describe("cleanUpExpiredCaptchas", (): void => {
    it("should not remove captchas that have not expired", (): void => {
      cleanUpExpiredCaptchas();

      expect(captchaMap[mockCaptchaId]).toBeDefined();
      expect(captchaImageMap[mockImages[0].id]).toBeDefined();
      expect(captchaImageMap[mockImages[1].id]).toBeDefined();
    });

    it("should remove captchas that have expired", (): void => {
      captchaMap[mockCaptchaId].expirationTime = Date.now() - 1000;

      cleanUpExpiredCaptchas();

      expect(captchaMap[mockCaptchaId]).toBeUndefined();
      expect(captchaImageMap[mockImages[0].id]).toBeUndefined();
      expect(captchaImageMap[mockImages[1].id]).toBeUndefined();
    });

    it("should log messages when cleaning expired captchas", (): void => {
      captchaMap[mockCaptchaId].expirationTime = Date.now() - 1000;

      cleanUpExpiredCaptchas();

      expect(consoleSpy).toHaveBeenCalledWith(
        `Captcha with ID ${mockCaptchaId} has expired and been removed.`
      );
    });
  });

  describe("checkExpiredCaptcha", (): void => {
    it("should not remove a captcha that has not expired", (): void => {
      checkExpiredCaptcha(mockCaptchaId);

      expect(captchaMap[mockCaptchaId]).toBeDefined();
      expect(captchaImageMap[mockImages[0].id]).toBeDefined();
      expect(captchaImageMap[mockImages[1].id]).toBeDefined();
    });

    it("should remove a captcha that has expired", (): void => {
      captchaMap[mockCaptchaId].expirationTime = Date.now() - 1000;

      checkExpiredCaptcha(mockCaptchaId);

      expect(captchaMap[mockCaptchaId]).toBeUndefined();
      expect(captchaImageMap[mockImages[0].id]).toBeUndefined();
      expect(captchaImageMap[mockImages[1].id]).toBeUndefined();
    });

    it("should log message when removing an expired captcha", (): void => {
      captchaMap[mockCaptchaId].expirationTime = Date.now() - 1000;

      checkExpiredCaptcha(mockCaptchaId);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Captcha with ID ${mockCaptchaId} has expired and been removed.`
      );
    });

    it("should do nothing if captcha ID does not exist", (): void => {
      const nonExistentId: string = "non-existent-captcha";

      checkExpiredCaptcha(nonExistentId);

      expect(captchaMap[nonExistentId]).toBeUndefined();
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });
});