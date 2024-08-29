import { Resolver, Mutation, ObjectType, Field, Ctx, Query } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { MyContext } from "..";
import { imageMap } from '../imageMap';
import fs from "fs";
import path from 'path';

@ObjectType()
class CaptchaResponse {
  @Field()
  id: string;

  @Field(() => [CaptchaImage])
  images: CaptchaImage[];

  @Field()
  challengeType: string;
}

@ObjectType()
class CaptchaImage {
  @Field()
  id: string;

  @Field()
  url: string;

  @Field()
  type: string;
}

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
      
      imageMap[imageId] = image.src;

      return {
        id: imageId,
        url: imageUrl,
        type: image.type,
      };
    });

    return {
      id,
      images: captchaImages,
      challengeType
    };
  }
}