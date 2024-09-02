export const captchaImageMap: Record<string, string> = {};

type captchaMapObj = {
    id : string;
    images : any[];
    challengeType : string;
    expirationTime : any;
}

export const captchaMap: Record<string, captchaMapObj> = {};

export const cleanUpExpiredCaptchas: () => void = (): void => {
  console.log("starting captcha cleaning!")
  const now = Date.now();

  for (const id in captchaMap) {
    if (captchaMap[id].expirationTime <= now) {
      captchaMap[id].images.forEach((element: any) => {
        delete captchaImageMap[element.id];
      });
      delete captchaMap[id];
      console.log(`Captcha with ID ${id} has expired and been removed.`);
    }
  }
  console.log("finished captcha cleaning!")
}

export const checkExpiredCaptcha: (id : string) => void = (id : string): void => {
  const now = Date.now();
  if (captchaMap[id]?.expirationTime <= now) {
    captchaMap[id]?.images.forEach((element: any) => {
      delete captchaImageMap[element.id];
    });
    delete captchaMap[id];
    console.log(`Captcha with ID ${id} has expired and been removed.`);
  }
}