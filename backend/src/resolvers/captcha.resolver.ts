import { Resolver, Mutation, ObjectType, Field, Ctx, Query } from 'type-graphql';
import { v4 as uuidv4 } from 'uuid';
import { MyContext } from "..";
import { imageMap } from '../imageMap';

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

    const images = [
      { src: 'cat1.jpg', type: 'cat' },
      { src: 'cat2.jpg', type: 'cat' },
      { src: 'cat3.jpg', type: 'cat' },
      { src: 'dog1.jpg', type: 'dog' },
      { src: 'dog2.jpg', type: 'dog' },
      { src: 'dog3.jpg', type: 'dog' },
      { src: 'car1.jpg', type: 'car' },
      { src: 'car2.jpg', type: 'car' },
      { src: 'car3.jpg', type: 'car' },
    ];

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