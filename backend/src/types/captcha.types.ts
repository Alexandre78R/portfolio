import { 
    ObjectType,
    Field,
  } from 'type-graphql';
  
  @ObjectType()
  export class CaptchaResponse {
    @Field()
    id: string;
  
    @Field(() => [CaptchaImage])
    images: CaptchaImage[];
  
    @Field()
    challengeType: string;
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
  