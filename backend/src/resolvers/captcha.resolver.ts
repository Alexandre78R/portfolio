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
  captchaMap
} from '../CaptchaMap';
import fs from "fs";
import path from 'path';
import { 
  CaptchaResponse,
  ValidationResponse
} from '../types/captcha.types';

@Resolver()
export class CaptchaResolver {

  @Query(() => CaptchaResponse)
  async generateCaptcha(@Ctx() context: MyContext): Promise<CaptchaResponse> {
    const id = uuidv4();

    const imagesDir = path.join(__dirname, '..', 'images');

    const files = fs.readdirSync(imagesDir);

    const images = files.map(file => {
      const fileName = path.basename(file, path.extname(file));
      const [type, _] = fileName.split('-');
      return { src: file, type };
    });
    
    const getRandomImagesByType = (type: 'cat' | 'dog' | 'car') => {
      return images
        .filter(image => image.type === type)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);
    };

    const selectedImages = [
      ...getRandomImagesByType('cat'),
      ...getRandomImagesByType('dog'),
      ...getRandomImagesByType('car')
    ].sort(() => Math.random() - 0.5);

    const challenges = ['cat', 'dog', 'car'] as const;
    const challengeType = challenges[Math.floor(Math.random() * challenges.length)];

    const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';

    const captchaImages = selectedImages.map(image => {
      const imageId = uuidv4();
      const imageUrl = `${BASE_URL}/dynamic-images/${imageId}`;
      
      captchaImageMap[imageId] = image.src;

      return {
        id: imageId,
        url: imageUrl,
        type: image.type,
      };
    });

    const resultCaptcha = {
      id,
      images: captchaImages,
      challengeType
    }

    captchaMap[id] = resultCaptcha;

    return resultCaptcha;
  }

  @Mutation(() => ValidationResponse)
  validateCaptcha(
    @Arg('selectedIndices', () => [Number]) selectedIndices: number[],
    @Arg('challengeType') challengeType: string,
    @Arg('idCaptcha') idCaptcha: string
  ): ValidationResponse {

    if (!captchaMap[idCaptcha])
      throw new Error("Expired captcha!")

    let images : any[] = [];
    for (const _ in captchaMap) {
      images =  captchaMap[idCaptcha].images;
    }

    if (!images)
      throw new Error("Expired captcha!")

    const correctIndices = images
      .map((img, idx) => img.type === challengeType ? idx : -1)
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
  clearCaptcha(@Arg('idCaptcha') idCaptcha: string): boolean {
    if (!captchaMap[idCaptcha]) {
      return true;
    }

    captchaMap[idCaptcha].images.forEach((element: any) => {
      delete captchaImageMap[element.id];
    });

    delete captchaMap[idCaptcha];
    return true;
  }
}