import { 
    ObjectType,
    Field,
  } from 'type-graphql';
  
  @ObjectType()
  export class ChallengeTypeTranslation {
    @Field()
    typeEN: string;

    @Field()
    typeFR: string;
  }

  @ObjectType()
  export class CaptchaResponse {
    @Field()
    id: string;
  
    @Field(() => [CaptchaImage])
    images: CaptchaImage[];
  
    @Field()
    challengeType: string;

    @Field(() => ChallengeTypeTranslation)
    challengeTypeTranslation: ChallengeTypeTranslation;
  
    @Field()
    expirationTime: number;
  }
  
  @ObjectType()
  export class CaptchaImage {
    @Field()
    id: string;
  
    @Field()
    url: string;
  
    @Field()
    typeEN: string;

    @Field()
    typeFR: string;
  }
  
  @ObjectType()
  export class ValidationResponse {
    @Field()
    isValid: boolean;
  }
  