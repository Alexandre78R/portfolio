import { 
  Resolver,
  Mutation,
  Ctx,
  Query,
  Arg
} from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { MyContext } from "..";
import { 
  captchaImageMap,
  captchaMap,
  checkExpiredCaptcha
} from '../CaptchaMap';
import fs from "fs";
import path from 'path';
import { 
  CaptchaResponse,
  ValidationResponse,
  ChallengeTypeTranslation,
} from '../types/captcha.types';

@Resolver()
export class CaptchaResolver {

  @Query(() => CaptchaResponse)
  async generateCaptcha(@Ctx() context: MyContext): Promise<CaptchaResponse> {
    
    const id = uuidv4();

    const imagesDir = path.join(__dirname, '..', 'images/captcha');

    const files = fs.readdirSync(imagesDir);

    const images = files.map(file => {
      const fileName = path.basename(file, path.extname(file));
      const [typeEN, typeFR, _] = fileName.split('-');
      return { src: file, typeEN, typeFR };
    });
    
    const categories = [...new Set(images.map(image => image.typeEN))];

    const selectedImages = categories
    .map(category => {
      return images
        .filter(image => image.typeEN === category)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    })
    .reduce((acc, val) => acc.concat(val), [])
    .sort(() => Math.random() - 0.5);

    const challenges = categories;
    const challengeType = challenges[Math.floor(Math.random() * challenges.length)];

    const challengeTypeFR = images.find(image => image.typeEN === challengeType)?.typeFR || '';

    const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

    const captchaImages = selectedImages.map(image => {
      const imageId = uuidv4();
      const imageUrl = `${BASE_URL}/api/dynamic-images/${imageId}`;
      
      captchaImageMap[imageId] = image.src;

      return {
        id: imageId,
        url: imageUrl,
        typeEN: image.typeEN,
        typeFR : image.typeFR,
      };
    });

    const expirationTime = Date.now() + 15 * 60 * 1000;

    const challengeTypeTranslation: ChallengeTypeTranslation = {
      typeEN: challengeType,
      typeFR: challengeTypeFR,
    };

    const resultCaptcha = {
      id,
      images: captchaImages,
      challengeType,
      challengeTypeTranslation,
      expirationTime
    }

    captchaMap[id] = resultCaptcha;

    console.log("captchaImageMap",captchaImageMap)
    console.log("captchaMap[id]", captchaMap[id]);
    console.log("captchaMap", captchaMap); 

    return resultCaptcha;
  }

  @Mutation(() => ValidationResponse)
  async validateCaptcha(
    @Arg('selectedIndices', () => [Number]) selectedIndices: number[],
    @Arg('challengeType') challengeType: string,
    @Arg('idCaptcha') idCaptcha: string,
    @Ctx() context: MyContext
  ): Promise<ValidationResponse> {

    checkExpiredCaptcha(idCaptcha);

    if (!captchaMap[idCaptcha])
      throw new Error("Expired captcha!")

    let images : any[] = [];
    for (const _ in captchaMap) {
      images = captchaMap[idCaptcha].images;
    }

    if (!images)
      throw new Error("Expired captcha!")

    const correctIndices = images
    .map((img, idx) => img.typeEN === challengeType ? idx : -1)
    .filter(idx => idx !== -1);
    
    const isValid = correctIndices.length === selectedIndices.length &&
      selectedIndices.every(index => correctIndices.includes(index));

      if (isValid) {
        captchaMap[idCaptcha].images.forEach((element: any) => {
          delete captchaImageMap[element.id];
        });
    
        delete captchaMap[idCaptcha];
      }

    return { isValid };
  }

  @Mutation(() => Boolean)
  async clearCaptcha(@Arg('idCaptcha') idCaptcha: string, @Ctx() context: MyContext): Promise<boolean> {
    
    if (!captchaMap[idCaptcha]) {
      return true;
    }

    delete captchaMap[idCaptcha];
    return true;
  }
}